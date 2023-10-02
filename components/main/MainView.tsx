import MainButton from './MainButton';

export default function MainView() {
  return (
    <div className='flex w-screen flex-col items-center'>
      <img src='/logo.png' alt='logo' />
      <MainButton href='/story'>시작하기</MainButton>
      <MainButton href='/load'>불러오기</MainButton>
      <MainButton href='/settings'>설정</MainButton>
      <MainButton href='/exit'>나가기</MainButton>
    </div>
  );
}
