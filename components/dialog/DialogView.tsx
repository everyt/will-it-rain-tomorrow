'use client';

import { useEffect, useRef, useState } from 'react';
import DialogBox from 'wirt@/components/dialog/DialogBox';

export default function DialogView({ json }: { json: Object }) {
  const extractNameAndDialogue = (json: string) => {
    const names: string[] = [];
    const dialogues: string[] = [];

    const data = JSON.parse(json);

    data.forEach((item: { [key: string]: string }) => {
      const key = Object.keys(item)[0];
      if (key) {
        const value = item[key].trim();
        if (value !== '') {
          names.push(key);
          dialogues.push(value);
        }
      }
    });

    return [names, dialogues];
  };

  const [names, dialogues] = extractNameAndDialogue(JSON.stringify(json));
  const isMount = useRef(false);
  const [flow, setFlow] = useState('next');
  const [index, setIndex] = useState(0);
  const [name, setName] = useState(names[index]);
  const [dialog, setDialog] = useState(dialogues[index]);

  useEffect(() => {
    if (isMount.current) {
      const isNext = () => {
        if (flow === 'next') {
          setIndex((prev) => prev + 1);
          setName(names[index]);
          setDialog(dialogues[index]);
        }
      };
      isNext();
    } else {
      isMount.current = true;
    }
  }, [flow]);

  return (
    <DialogBox
      flow={flow}
      setFlow={setFlow}
      name={name}
    >
      {dialog}
    </DialogBox>
  );
}
