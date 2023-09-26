import Link from 'next/link';

export default function MainView() {
  return (
    <div>
      <b>will it rain tomorrow?</b>
      <Link href={'/dialog'}>
        <p>넘어가기</p>
      </Link>
    </div>
  );
}
