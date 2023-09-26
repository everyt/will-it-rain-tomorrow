'use client';

import { useEffect, useState } from 'react';
import useInterval from 'wirt@/hooks/useInterval';

const skipDictionary = [' ', '.', ',', '!', '?', '"', "'", '`', '~'];

type DialogBoxProps = {
  children?: string;
  name?: string;
  flow: string;
  setFlow: Function;
};

export default function DialogBox({
  children = '',
  name,
  flow,
  setFlow,
}: DialogBoxProps) {
  const [delay, setDelay] = useState(400);
  const [text, setText] = useState('');
  const [isRunning, setisRunning] = useState(true);

  const checkNewDialog = () => {
    if (flow === 'next') {
      setFlow('start');
      setisRunning(true);
      setText('');
    }
  };

  useEffect(() => {
    checkNewDialog();
  }, [flow]);

  const typing = () => {
    if (skipDictionary.indexOf(children[text.length]) >= 0) setDelay(10);
    if (children[text.length] !== undefined)
      setText((previousText) => previousText + children[text.length]);
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
    <div
      className='absolute bottom-[-20px] h-1/3 w-screen bg-stone-100 m-5 border-2 border-stone-700 rounded-2xl'
      onClick={(ev) => {
        ev.preventDefault();
        isRunning ? setFlow('skip') : setFlow('next');
      }}
    >
      {name !== 'null' && <div className='dialogBox-name'>{name}</div>}
      <div className='m-2'>
        <div className='text-[2.8vh]'>{text}</div>
      </div>
    </div>
  );
}
