'use client';

import { Icon } from '@iconify-icon/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { appWindow } from '@tauri-apps/api/window';
import { AnimationControls, motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [onHoverWrapper, setOnHoverWrapper] = useState(false);

  const [onHoverMainmenu, setOnHoverMainmenu] = useState(false);
  const [onHoverMinimize, setOnHoverMinimize] = useState(false);
  const [onHoverMaximize, setOnHoverMaximize] = useState(false);
  const [onHoverFullscreen, setOnHoverFullscreen] = useState(false);
  const [onHoverClose, setOnHoverClose] = useState(false);

  const controlWrapper = useAnimation();

  const controlMainmenu = useAnimation();
  const controlMinimize = useAnimation();
  const controlMaximize = useAnimation();
  const controlFullscreen = useAnimation();
  const controlClose = useAnimation();

  const pathname = usePathname();

  const handleOnHoverWrapper = (isOnHover: boolean) => {
    if (!isOnHover) {
      setOnHoverMainmenu(false);
      setOnHoverMinimize(false);
      setOnHoverMaximize(false);
      setOnHoverFullscreen(false);
      setOnHoverClose(false);
      controlMainmenu.start({ opacity: 0.3 });
      controlMinimize.start({ opacity: 0.3 });
      controlMaximize.start({ opacity: 0.3 });
      controlFullscreen.start({ opacity: 0.3 });
      controlClose.start({ opacity: 0.3 });
    }
    setOnHoverWrapper(isOnHover);
  };
  const handleOnHoverButton = (
    controls: AnimationControls,
    setOnHover: Function,
    isOnHover: boolean,
  ) => {
    if (isOnHover) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0.3 });
    }
    setOnHover(isOnHover);
  };
  const router = useRouter();
  const mainmenu = () => {
    router.push('/');
    handleOnHoverButton(controlMainmenu, setOnHoverMainmenu, false);
  }
  const minimize = async () => {
    await appWindow.setResizable(true);
    await appWindow.minimize();
    await appWindow.setResizable(false);
    await handleOnHoverButton(controlMinimize, setOnHoverMinimize, false);
  };
  const maximize = async () => {
    await setIsMaximized((prev) => !prev);
    await appWindow.setResizable(true);
    await appWindow.toggleMaximize();
    await appWindow.setResizable(false);
    await handleOnHoverButton(controlMaximize, setOnHoverMaximize, false);
  };
  const fullscreen = async () => {
    await setIsFullscreen((prev) => !prev);
    await setOnHoverWrapper(false);
    await appWindow.setResizable(true);
    await appWindow.setFullscreen(!isFullscreen);
    await appWindow.setResizable(false);
    await handleOnHoverButton(controlFullscreen, setOnHoverFullscreen, false);
  };
  const close = () => {
    appWindow.close();
  };

  useEffect(() => {
    if (isFullscreen && !onHoverWrapper) {
      controlWrapper.start({ opacity: 0 });
    } else {
      controlWrapper.start({ opacity: 1 });
    }
  }, [onHoverWrapper, isFullscreen]);

  return (
    <motion.div
      data-tauri-drag-region
      initial={{ opacity: 1 }}
      animate={controlWrapper as AnimationControls}
      className='absolute left-0 top-0 z-[999] flex h-[30px] w-screen items-center justify-end p-2'
      onMouseOver={() => handleOnHoverWrapper(true)}
      onMouseOut={() => handleOnHoverWrapper(false)}
    >
      {[
        [controlMainmenu, mainmenu, 'back', onHoverMainmenu, setOnHoverMainmenu],
        [controlFullscreen, fullscreen, 'fullscreen-2', onHoverFullscreen, setOnHoverFullscreen],
        [controlMinimize, minimize, 'minimize', onHoverMinimize, setOnHoverMinimize],
        [controlMaximize, maximize, 'fullscreen', onHoverMaximize, setOnHoverMaximize],
        [controlClose, close, 'close', onHoverClose, setOnHoverClose],
      ].map(([controls, onClick, icon, onHover, setOnHover], index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.3 }}
          animate={controls as AnimationControls}
          className='ml-2 h-[24px] w-[24px] cursor-pointer'
        >
          <Icon
            className={pathname === '/story' ? 'text-white' : 'text-black'}
            icon={`mingcute-${
              icon == 'fullscreen' && isMaximized
                ? 'restore'
                : icon == 'fullscreen-2' && isFullscreen
                ? 'fullscreen-exit-2'
                : icon
            }-${onHover ? 'fill' : 'line'}`}
            onClick={onClick as () => void}
            onMouseEnter={() =>
              handleOnHoverButton(controls as AnimationControls, setOnHover as Function, true)
            }
            onMouseLeave={() =>
              handleOnHoverButton(controls as AnimationControls, setOnHover as Function, false)
            }
            style={{ fontSize: '24px' }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
