'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

import DialogueDisplay from 'wirt@/components/dialogue/DialogueDisplay';

type doc = {
  names: stringornull[];
  titles: stringornull[];
  dialogues: stringornull[];
  backgrounds: stringornull[];
}
type stringornull = string | null;

export default function DialogueInput({ json }: { json: Object[] }) {
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

  const extractToList = (json: Object[]) => {
    const list: doc[] = [];
    for (let i = 0; i < json.length; i++) {
      const [names, titles, dialogues, backgrounds] = extractNameAndDialogue(JSON.stringify(json[i]));
      list.push({names, titles, dialogues, backgrounds});
    };
    return list;
  }

  const [docList, setDocList] = useState<doc[]>(extractToList(json));
  const [docCount, setDocCount] = useState<number>(0);
  const [flow, setFlow] = useState('next');
  const [index, setIndex] = useState(0);
  const name = useRef<string>('');
  const title = useRef<string>('');
  const dialogue = useRef<string>('');
  const background = useRef<string>('');
  let timeOfTheEnd = false;
  let swapPage = false;

  useEffect(() => {
    const isNext = async() => {
      if (flow === 'next' && timeOfTheEnd === false) {
        const insertDocData = () => {
          if (docList[docCount].backgrounds[index] !== null && docList[docCount].backgrounds[index] !== undefined) background.current = docList[docCount].backgrounds[index]!;
          if (docList[docCount].titles[index] !== null &&      docList[docCount].titles[index] !== undefined)      title.current = docList[docCount].titles[index]!;
          if (docList[docCount].names[index] !== null &&       docList[docCount].names[index] !== undefined)       name.current = docList[docCount].names[index]!;
          if (docList[docCount].dialogues[index] === null && index === 0) {
            if (docList[docCount].dialogues[index+1] !== undefined && docList[docCount].dialogues[index+1] !== null) {
              dialogue.current = docList[docCount].dialogues[index+1]!;
            }
          } else if (docList[docCount].dialogues[index] !== null && index !== 0) {
              dialogue.current = docList[docCount].dialogues[index]!;
          }
        }
        if (  docList[docCount].dialogues[index] === undefined && index !== 0) {
          if (docList[docCount+1] === undefined) {
            timeOfTheEnd = true;
            dialogue.current = '';
            await fadeController.start({ opacity: 1, transition: { ease: 'easeIn' }});
            await setTimeout(function() { router.push('/') }, 800);
          } else {
            fadeController.start({ opacity: 1, transition: { ease: 'easeIn' }});
            swapPage = true;
            await setIndex(0);
            await setDocCount((prev) => prev + 1);
            await setTimeout(function() { fadeController.start({ opacity: 0, transition: { ease: 'easeOut' }}) }, 800);
            await insertDocData();
          }
        }
        await insertDocData();
        setIndex((prev) => prev + 1);
      }
    }
    isNext();
  }, [flow]);

  const fadeController = useAnimation();
  const isMounted = useRef(false);

  useEffect(() => {
    if(isMounted.current) {
      fadeController.start({ opacity: 0, transition: { ease: 'easeOut' }});
    } else {
      isMounted.current = true;
    }
  }, []);

  return (
    <>
    <motion.div
      className='absolute left-0 top-0 z-30 h-screen w-screen bg-black'
      initial={{ opacity: 1 }}
      animate={fadeController}
      transition={{ duration: 1 }}
      onClick={() => flow === 'typing' ? setFlow('skip') : setFlow('end')}
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
