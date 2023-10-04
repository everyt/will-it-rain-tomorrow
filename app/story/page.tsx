import DialogueInput from 'wirt@/components/dialogue/DialogueInput';

import prologue from 'wirt@/string/prologue.json';
import chapter1 from 'wirt@/string/chapter1.json';

export default function page() {
  const jsonList = [prologue, chapter1];
  return <DialogueInput json={jsonList} />;
}
