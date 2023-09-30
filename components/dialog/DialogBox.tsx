'use client';

import { useEffect, useRef, useState } from 'react';
import useInterval from 'wirt@/hooks/useInterval';

type DialogBoxProps = {
  flow: string;
  setFlow: Function;
  children: string;
  name?: string;
  image?: string;
  title?: string;
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

export default function DialogBox({ flow, setFlow, children, name, image, title }: DialogBoxProps) {
  const [delay, setDelay] = useState(100);

// 대화 분해용 React 변수 ㅡㅡ────────────────────────────────────────────────────┐┌────┐
  const letters = useRef<letters[]>([]);                        //EveryHongCha ││ ┌──┘
  const lettersMap = useRef<lettersMap[]>([]);                               //││ └──┐
  const [lettersMapState, setLettersMapState] = useState<lettersMap[]>([]);  //││ ┌──┘
  const [typingCount, setTypingCount] = useState<number>(0);                 //││ └──┐
// Flow 관리자 ─────────────────────────────────────────────────────────────────┤└────┘
  useEffect(() => {                                             //EveryHongCha │┌─┐┌─┐
    if ( flow === 'next' ) {                                                 //││ ││ │
      setFlow('start');                                                      //││ ││ │
    }                                                                        //││ ││ │
    if (flow === 'end') {                                                    //││ └┘ │
      setFlow('next');                                                       //│└────┘
      setTypingCount(0);                                                     //│┌────┐
      letters.current = [];                                                  //││ ┌──┘
      lettersMap.current = [];                                               //││ └──┐
      setLettersMapState([]);                                                //││ ┌──┘
    }                                                                        //││ └──┐
  }, [flow]);                                                                //│└────┘
  useInterval(                                                               //│┌────┐
    () => {                                                                  //││ ┌┐ │
      console.log(flow);                                                     //││ └┘┌┘
      setDelay(flow === 'skip' ? 0 : 100);                                   //││ ┌┐└┐
      typing();                                                 //EveryHongCha ││ ││ │
    }, // ─────────────────────────────────────────────────────────────────────┤└─┘└─┘
    flow === 'start'    ? 0                           // start: 대화가 시작함    │┌─┐┌─┐
  : flow === 'typing'   ? delay                       // typing: 타이핑         ││ ││ │
  : flow === 'skip'     ? 0                           // skip: 스킵함           ││ └┘ │
  : flow === 'delayEnd' ? 2000                        // delayEnd: 종료를 딜레이 │└──┐ │
  : null,                                             // end: 종료함            │┌──┘ │
  ); //                                                                        │└────┘
// 타이핑 시스템 ────────────────────────────────────────────────────────────────┤┌─┐┌─┐
  const typing = () => {                                        //EveryHongCha ││ ││ │
    const initializeDialog = () => {                                         //││ └┘ │
      if (children) {                                                        //││ ┌┐ │
        let tempLetters = children.split('');                                //││ ││ │
        let letter = '';                                                     //│└─┘└─┘
        for (let i = 0; i < tempLetters.length; i++) {                       //│┌────┐
          letter = tempLetters[i];                                           //││ ┌┐ │
          let type = 'text';                                                 //││ ││ │
          if (tempLetters[i] === '<') {                                      //││ ││ │
            i++;                                                             //││ └┘ │
            type = tempLetters[i] === '/' ? 'closingTag' : 'startingTag';    //│└────┘
            while (tempLetters[i] !== '>') {                                 //│┌────┐
              letter += tempLetters[i];                                      //││ ┌┐ │
              i++;                                                           //││ ││ │
            }                                                                //││ ││ │
            letter += tempLetters[i];                                        //││ ││ │
          }                                                                  //│└─┘└─┘
          if (letter === ' ') letter = '&nbsp;';                             //│┌────┐
          letters.current.push({letter, type});                              //││ ┌──┘
        }                                                                    //││ │┌─┐
        for (let i= 0; i < letters.current.length; i++) {                    //││ ││ │
          if (letters.current[i].type === 'text') {                          //││ └┘ │
            lettersMap.current.push({prefix: null, suffix: null, letter: i}) //│└────┘
          } else if (letters.current[i].type === 'startingTag') {            //│┌────┐
            let j = 0;                                                       //││ ┌──┘
            let k = i;                                                       //││ │
            while (letters.current[i].type !== 'closingTag') {               //││ │
              i++;                                                           //││ └──┐
              j++;                                                           //│└────┘
            }                                                                //│┌─┐┌─┐
            const tempLettersMap: lettersMap[] = [];                         //││ ││ │
            for (j; j > 1; j--) {                                            //││ └┘ │
              tempLettersMap.push({prefix: k, suffix: i, letter: j + k - 1}) //││ ┌┐ │
            }                                                                //││ ││ │
            lettersMap.current.push(...tempLettersMap.reverse());            //│└─┘└─┘
          }                                                                  //│┌────┐
        }                                                                    //││ ┌┐ │
        setLettersMapState(lettersMap.current);                              //││ └┘ │
      } else {                                                               //││ ┌┐ │
        console.log('DialogBox: children is null.');                         //││ ││ │
      }                                                                      //│└─┘└─┘
    }                                                                        //│
    if (flow === 'start') {                                                  //│
      initializeDialog();                                                    //│
      setFlow('typing');                                                     //│
    } else if (flow === 'typing' || flow === 'skip') {                       //│
      if (typingCount <= lettersMapState.length) {                           //│
        setTypingCount(prev => prev + 1);                                    //│
      } else {                                                               //│
        setFlow('delayEnd');                                                 //│
      }                                                                      //│
    } else if (flow === 'delayEnd') {                                        //│
      setFlow('end');                                                        //│
    }                                                                        //│
  };                                                            //EveryHongCha │
// 키보드 입력 이벤트 ㅡ──────────────────────────────────────────────────────────┤
  useEffect(() => {                                             //EveryHongCha │
    const handleKeyPress = (ev: KeyboardEvent) => {                          //│
      ev.preventDefault();                                                   //│
      ev.stopPropagation();                                                  //│
      if(!ev.isComposing) {                                                  //│
        if (ev.key === 'Enter' || ev.key === ' ') {                          //│
          flow === 'typing' ? setFlow('skip') : setFlow('end')               //│
        }                                                                    //│
      }                                                                      //│
    }                                                                        //│
    document.addEventListener('keypress', handleKeyPress);                   //│
    return () => document.removeEventListener('keypress', handleKeyPress);   //│
  }, [children, flow])                                          //EveryHongCha │
// ────────────────────────────────────────────────────────────────────────────┘

  return (
    <>
      {image && <img src={image} className='absolute left-0 top-0 z-10 object-cover' />}
      <div className='absolute left-0 top-0 z-20 flex h-1/6 w-full flex-col justify-end bg-black text-white'>
        {title && <p className='m-5 text-[4vh]'>{title}</p>}</div>
      <div
        className='absolute bottom-[-20px] left-[-20px] z-20 m-5 h-1/3 w-full bg-black text-white'
        onClick={() => flow === 'typing' ? setFlow('skip') : setFlow('end')}
      >
        {name !== 'null' && <div className='text-[3.5vh]'>{name}</div>}
        <div className='m-2'>
          <div className='flex content-center text-[2.8vh] flex-wrap w-[98%] m-4'>
            {lettersMapState.map((item, index) => (index < typingCount-1 && (
                <div key={index}
                  dangerouslySetInnerHTML={{__html: `${
                      item.prefix !== null ? letters.current[item.prefix].letter : ''}${
                      letters.current[item.letter].letter}${
                      item.suffix !== null ? letters.current[item.suffix].letter : ''}`,}}
              />
            )))}
            {lettersMapState.map((item, index) => (index === typingCount-1 && (
                <div key={index}
                  className='animate-fadeIn'
                  dangerouslySetInnerHTML={{__html: `${
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
