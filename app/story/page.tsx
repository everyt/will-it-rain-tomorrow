import DialogueInput from 'wirt@/components/dialogue/DialogueInput';

import prologue from 'wirt@/string/prologue.json';

export default function page() {
  return <DialogueInput json={prologue} />;
}
