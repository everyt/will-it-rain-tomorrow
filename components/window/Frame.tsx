import dynamic from 'next/dynamic';
import SplashScreen from './SplashScreen';
const TitleBar = dynamic(() => import('wirt@/components/window/TitleBar'), {
  ssr: false,
  loading: () => <SplashScreen />,
});

export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col h-screen w-screen z-0'>
      <TitleBar />
      <div className='h-screen w-screen flex justify-center items-center'>
        {children}
      </div>
    </div>
  );
}
