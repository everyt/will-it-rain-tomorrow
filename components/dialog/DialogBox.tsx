'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import useInterval from 'wirt@/hooks/useInterval';

const skipDictionary = [' ', '.', ',', '!', '?', '"', "'", '`', '~'];

type DialogBoxProps = {
  children?: string;
  name?: string;
  flow: string;
  setFlow: Function;
};

export default function DialogBox({ children = '', name, flow, setFlow }: DialogBoxProps) {
  const [delay, setDelay] = useState(400);
  const [text, setText] = useState('');
  const [prevText, setPrevText] = useState('');
  const [afterText, setAfterText] = useState('');
  const [isRunning, setisRunning] = useState(true);

  const controls = useAnimation();

  const checkNewDialog = () => {
    if (flow === 'next') {
      setFlow('start');
      setisRunning(true);
      setText('');
      setPrevText('');
      setAfterText('');
    }
  };

  useEffect(() => {
    checkNewDialog();
  }, [flow]);

  const typing = () => {
    if (skipDictionary.indexOf(children[text.length]) >= 0) setDelay(10);
    if (children[text.length] !== undefined) {
      setPrevText(text);
      setAfterText(children[text.length]);
      setText((previousText) => previousText + children[text.length]);
      controls.set({ opacity: 0 });
      controls.start({ opacity: 1 });
    }
    if (text.length >= children.length) {
      setisRunning(false);
    }
  };
  useInterval(
    () => {
      setDelay(flow === 'skip' ? 0 : 70);
      typing();
    },
    isRunning === true ? delay : null,
  );

  return (
    <>
      <img src='/background/nostalgia.jpg' className='absolute left-0 top-0 z-10 object-cover' />
      <div className='absolute left-0 top-0 z-20 flex h-1/6 w-full flex-col justify-end bg-black text-white'>
        <p className='m-5 text-[4vh]'>Nostalgia</p>
      </div>
      <div
        className='absolute bottom-[-20px] left-[-20px] z-20 m-5 h-1/3 w-full bg-black text-white'
        onClick={(ev) => {
          ev.preventDefault();
          isRunning ? setFlow('skip') : setFlow('next');
        }}
        onKeyDown={(ev) => {
          ev.preventDefault();
          if (ev.key === 'Space' || ev.key === 'Enter')
            isRunning ? setFlow('skip') : setFlow('next');
        }}
      >
        {name !== 'null' && <div className='text-[3.5vh]'>{name}</div>}
        <div className='m-2'>
          <div className='flex content-center text-[2.8vh]'>
            {prevText}
            <motion.p
              initial={{ opacity: 0 }}
              animate={controls}
              transition={{ ease: 'easeInOut' }}
            >
              {afterText}
            </motion.p>
          </div>
        </div>
      </div>
    </>
  );
}
