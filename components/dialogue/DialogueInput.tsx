'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import DialogueDisplay from 'wirt@/components/dialogue/DialogueDisplay';

type stringornull = string | null;

export default function DialogueInput({ json }: { json: Object }) {
  const router = useRouter();
  const extractNameAndDialogue = (json: string) => {
    const names: stringornull[] = [];
    const titles: stringornull[] = [];
    const effects: stringornull[] = [];
    const dialogues: stringornull[] = [];
    const backgrounds: stringornull[] = [];

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
      if (item.effect) {
        effects.push(item.effect);
      } else {
        effects.push('undefined');
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

    return [names, titles, effects, dialogues, backgrounds];
  };
  const [names, titles, effects, dialogues, backgrounds] = extractNameAndDialogue(JSON.stringify(json));
  const [flow, setFlow] = useState('next');
  const [index, setIndex] = useState(0);
  const name = useRef<string>('');
  const title = useRef<string>('');
  const effect = useRef<string>('');
  const dialogue = useRef<string>('');
  const background = useRef<string>('');

  useEffect(() => {
    const isNext = () => {
      if (flow === 'next') {
        if (    effects[index] !== 'undefined') effect.current = effects[index]!;
        if (  dialogues[index] ===  undefined  && index !== 0) router.push('/');
        if (backgrounds[index] !== 'undefined') background.current = backgrounds[index]!;
        if (     titles[index] !== 'undefined') title.current = titles[index]!;
        if (      names[index] !== 'undefined') name.current = names[index]!;
        if        (dialogues[index] === 'undefined' && index === 0) {
          dialogue.current = dialogues[index+1]!;
        } else if (dialogues[index] !== 'undefined' && index !== 0) {
          dialogue.current = dialogues[index]!;
        }
        setIndex((prev) => prev + 1);
      }
    }
    isNext();
  }, [flow]);

  return (
    <DialogueDisplay
     flow={flow}
     setFlow={setFlow}
     name={name.current}
     title={title.current}
     effect={effect.current}
     background={background.current}
    >
      {dialogue.current}
    </DialogueDisplay>
  );
}
