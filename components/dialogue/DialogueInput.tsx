'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import DialogueDisplay from 'wirt@/components/dialogue/DialogueDisplay';

export default function DialogueInput({ json }: { json: Object }) {
  const router = useRouter();
  const extractNameAndDialogue = (json: string) => {
    const names: string[] = [];
    const titles: string[] = [];
    const dialogues: string[] = [];
    const backgrounds: string[] = [];

    const data = JSON.parse(json);

    data.forEach((item: { [key: string]: string }) => {
      if (item.name) {
        names.push(item.name);
      } else {
        names.push('undefined');
      }
      if (item.title) {
        titles.push(item.title);
      } else {
        titles.push('undefined');
      }
      if (item.dialogue) {
        dialogues.push(item.dialogue);
      } else {
        dialogues.push('undefined');
      }
      if (item.background) {
        backgrounds.push(item.background);
      } else {
        backgrounds.push('undefined');
      }
    });

    return [titles, backgrounds, names, dialogues];
  };

  const [titles, backgrounds, names, dialogues] = extractNameAndDialogue(JSON.stringify(json));
  const [flow, setFlow] = useState('next');
  const [index, setIndex] = useState(0);
  const name = useRef<string>('');
  const title = useRef<string>('');
  const dialogue = useRef<string>('');
  const background = useRef<string>('');

  useEffect(() => {
    const isNext = () => {
      if (flow === 'next') {
        if ((backgrounds[index] === 'undefined'
           ||     titles[index] === 'undefined'
           ||      names[index] === 'undefined') && index === 0) setIndex((prev) => prev + 1);
        if (   dialogues[index] ===  undefined   && index !== 0) router.push('/');
        if (backgrounds[index] !== 'undefined') background.current = backgrounds[index]
        if (  dialogues[index] !== 'undefined') dialogue.current = dialogues[index]
        if (     titles[index] !== 'undefined') title.current = titles[index]
        if (      names[index] !== 'undefined') name.current = names[index];
        setIndex((prev) => prev + 1);
      }
    };
    isNext();
  }, [flow]);

  return (
    <DialogueDisplay
     flow={flow}
     setFlow={setFlow}
     name={name.current}
     title={title.current}
     background={background.current}
    >
      {dialogue.current}
    </DialogueDisplay>
  );
}
