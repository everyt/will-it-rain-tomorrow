'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import DialogueDisplay from 'wirt@/components/dialogue/DialogueDisplay';

type stringornull = string | null;

export default function DialogueInput({ json }: { json: Object }) {
  const router = useRouter();
  const extractNameAndDialogue = (json: string) => {
    const names: stringornull[] = [];
    const titles: stringornull[] = [];
    const dialogues: stringornull[] = [];
    const backgrounds: stringornull[] = [];

    const data = JSON.parse(json);

    data.forEach((item: { [key: string]: string }) => {
      if (item.name) {
        names.push(item.name);
      } else {
        names.push(null);
      }
      if (item.title) {
        titles.push(item.title);
      } else {
        titles.push(null);
      }
      if (item.dialogue) {
        dialogues.push(item.dialogue);
      } else {
        dialogues.push(null);
      }
      if (item.background) {
        backgrounds.push(item.background);
      } else {
        backgrounds.push(null);
      }
    });

    return [names, titles, dialogues, backgrounds];
  };
  const [names, titles, dialogues, backgrounds] = extractNameAndDialogue(JSON.stringify(json));
  const [flow, setFlow] = useState('next');
  const [index, setIndex] = useState(0);
  const name = useRef<string>('');
  const title = useRef<string>('');
  const dialogue = useRef<string>('');
  const background = useRef<string>('');

  useEffect(() => {
    const isNext = () => {
      if (flow === 'next') {
        if (  dialogues[index] === undefined && index !== 0) router.push('/');
        if (backgrounds[index] !== null) background.current = backgrounds[index]!;
        if (     titles[index] !== null)      title.current = titles[index]!;
        if (      names[index] !== null)       name.current = names[index]!;
        if        (dialogues[index] === null && index === 0) {
                                           dialogue.current = dialogues[index+1]!;
        } else if (dialogues[index] !== null && index !== 0) {
                                           dialogue.current = dialogues[index]!;
        }
        setIndex((prev) => prev + 1);
      }
    }
    isNext();
  }, [flow]);

  return (
    <>
    <motion.div
      className='absolute left-0 top-0 z-30 h-screen w-screen bg-black'
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1 }}
    />
    <DialogueDisplay
     flow={flow}
     setFlow={setFlow}
     name={name.current}
     title={title.current}
     background={background.current}
    >
      {dialogue.current}
    </DialogueDisplay>
    </>
  );
}
