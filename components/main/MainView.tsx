import MenuButton from './MenuButton';

export default function MainView() {
  return (
    <div className='flex w-screen flex-col items-center'>
      <img src='/logo.png' alt='logo' />
      <MenuButton href='/story'>시작하기</MenuButton>
      <MenuButton href='/load'>불러오기</MenuButton>
      <MenuButton href='/settings'>설정</MenuButton>
      <MenuButton href='/exit'>나가기</MenuButton>
    </div>
  );
}
