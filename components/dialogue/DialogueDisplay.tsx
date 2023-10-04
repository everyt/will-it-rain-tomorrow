'use client';

import { useEffect, useRef, useState } from 'react';
import useInterval from 'wirt@/hooks/useInterval';

type DialogueDisplayProps = {
  flow: string;
  setFlow: Function;
  children: string;
  name?: string;
  title?: string;
  background?: string;
};
type letters = {
  letter: string;
  type: string;
}
type lettersMap = {
  prefix: number | null;
  suffix: number | null;
  letter: number;
}

export default function DialogueDisplay({ flow, setFlow, children, name, title, background }: DialogueDisplayProps) {
  const delay = useRef(100);
// 대화 분해용 React 변수 ㅡㅡ────────────────────────────────────────────────────
  const letters = useRef<letters[]>([]);
  const lettersMap = useRef<lettersMap[]>([]);
  const [lettersMapState, setLettersMapState] = useState<lettersMap[]>([]);
  const [typingCount, setTypingCount] = useState<number>(0);
// Flow 관리자 ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if ( flow === 'next' ) {
      setFlow('start');
    }
    if (flow === 'end') {
      setFlow('next');
      setTypingCount(0);
      letters.current = [];
      lettersMap.current = [];
      setLettersMapState([]);
    }
  }, [flow]);
  useInterval(
    () => {
      typing();
    }, // ─────────────────────────────────────────────────────────────────────
    flow === 'start'    ? 0                           // start: 대화가 시작함         
  : flow === 'typing'   ? delay.current               // typing: 타이핑
  : flow === 'skip'     ? 0                           // skip: 스킵함
  : flow === 'delayEnd' ? 2000                        // delayEnd: 종료를 딜레이
  : null,                                             // end: 종료함
  );
// 타이핑 시스템 ────────────────────────────────────────────────────────────────
  const typing = () => {
    const initializeDialog = () => { // 새 대화를 위한 초기화
      if (children) {
        let tempLetters = children.split(''); // children 분해
        let letter = '';
        for (let i = 0; i < tempLetters.length; i++) { // 반복문
          letter = tempLetters[i];
          let type = 'text';
          if (letter === ' ') letter = '&nbsp;';
          if (letter === '<') { // 태그 처리 시작
            i++;
            type = tempLetters[i] === '/' ? 'closingTag' : 'startingTag';
            while (tempLetters[i] !== '>') {
              letter += tempLetters[i];
              i++;
            }
            letter += tempLetters[i];
          }
          letters.current.push({letter, type});
        }
        for (let i= 0; i < letters.current.length; i++) { // 처리한 children들을 반복문으로 재처리
          if (letters.current[i].type === 'text') {
            lettersMap.current.push({prefix: null, suffix: null, letter: i}) // lettersMap은 letters의 index를 기록함
          } else if (letters.current[i].type === 'startingTag') { // 태그 처리 시작
            let j = 0;
            let k = i; // i의 초기값을 기록함
            while (letters.current[i].type !== 'closingTag') {
              i++;
              j++;
            }
            const tempLettersMap: lettersMap[] = [];
            for (j; j > 1; j--) {
              tempLettersMap.push({prefix: k, suffix: i, letter: j + k - 1})
            }
            lettersMap.current.push(...tempLettersMap.reverse()); // 역순으로 반복문을 돌렸으니까 reverse 구조분해
          }
        }
        setLettersMapState(lettersMap.current);
      } else {
        console.log('※ DialogBox: children is null. ※');
      }
    }
    if (flow === 'start') {
      initializeDialog();
      setFlow('typing');
    } else if (flow === 'typing' || flow === 'skip') {
      if (typingCount <= lettersMapState.length) {
        setTypingCount(prev => prev + 1);
      } else {
        setFlow('delayEnd');
      }
    } else if (flow === 'delayEnd') {
      setFlow('end');
    }
  };
// 키보드 입력 이벤트 ㅡ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyPress = (ev: KeyboardEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if(!ev.isComposing) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          flow === 'typing' ? setFlow('skip') : setFlow('end')
        }
      }
    }
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [children, flow])
// ────────────────────────────────────────────────────────────────────────────

  return (
    <>{/*배경화면──────────────────────────────────────────────────────────────*/}
      {background !== 'null' && (
        <img src={background}
          className='object-cover
          absolute left-0 top-0 z-10'
        />
      )}
      {/*상단박스──────────────────────────────────────────────────────────────*/}
      <div
        className='h-1/6 w-full
        flex flex-col justify-end
        absolute left-0 top-0 z-20
        bg-black text-white'
      >
        {title !== 'null' && <p className='m-5 text-[4vh]'>{title}</p>}
      </div>
      {/*하단박스──────────────────────────────────────────────────────────────*/}
      <div
        className='h-1/3 w-full m-5
        absolute bottom-[-20px] left-[-20px] z-20
        bg-black text-white'
      >
        {name !== 'null' && <div className='text-[4.5vh] m-4'>{name}</div>}
        <div className='m-2'>
          <div
            className='w-[98%] m-4
            flex flex-wrap content-center
            text-[3.5vh]'
          >
            {lettersMapState.map((item, index) => (index < typingCount-1 && (
                <div key={index}
                  dangerouslySetInnerHTML={{__html:`${
                    item.prefix !== null ? letters.current[item.prefix].letter : ''}${
                      letters.current[item.letter].letter}${
                        item.suffix !== null ? letters.current[item.suffix].letter : ''}`,}}
              />
            )))}
            {lettersMapState.map((item, index) => (index === typingCount-1 && (
                <div key={index}
                  className='animate-fadeIn'
                  dangerouslySetInnerHTML={{__html:`${
                    item.prefix !== null ? letters.current[item.prefix].letter : ''}${
                    letters.current[item.letter].letter}${
                    item.suffix !== null ? letters.current[item.suffix].letter : ''}`,}}
              />
            )))}
          </div>
        </div>
      </div>
    </>
  );
}
