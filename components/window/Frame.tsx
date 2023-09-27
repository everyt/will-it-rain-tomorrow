import dynamic from 'next/dynamic';
import SplashScreen from './SplashScreen';

const TitleBar = dynamic(() => import('wirt@/components/window/TitleBar'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className='z-0 flex h-screen w-screen flex-col border-[0.1em] border-slate-500'>
      <TitleBar />
      <div className='flex h-screen w-screen items-center justify-center'>{children}</div>
    </div>
  );
}
