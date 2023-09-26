import DialogView from 'wirt@/components/dialog/DialogView';

import prologue from 'wirt@/string/prologue.json';

export default function page() {
  return <DialogView json={prologue} />;
}
