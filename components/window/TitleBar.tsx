'use client';

import { Icon } from '@iconify-icon/react';
import { appWindow } from '@tauri-apps/api/window';
import { AnimationControls, motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  const [onHoverMinimize, setOnHoverMinimize] = useState(false);
  const [onHoverMaximize, setOnHoverMaximize] = useState(false);
  const [onHoverClose, setOnHoverClose] = useState(false);

  const controlMinimize = useAnimation();
  const controlMaximize = useAnimation();
  const controlClose = useAnimation();

  const pathname = usePathname();

  const handleOnHover = (isOnHover: boolean) => {
    if (!isOnHover) {
      setOnHoverMinimize(false);
      setOnHoverMaximize(false);
      setOnHoverClose(false);
      controlMinimize.start({ opacity: 0.3 });
      controlMaximize.start({ opacity: 0.3 });
      controlClose.start({ opacity: 0.3 });
    }
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
  const minimize = async () => {
    await appWindow.setResizable(true);
    await appWindow.minimize();
    await appWindow.setResizable(false);
    setOnHoverMinimize(false);
  };
  const maximize = async () => {
    await setIsMaximized((prev) => !prev);
    await appWindow.setResizable(true);
    await appWindow.toggleMaximize(); // appWindow.setFullscreen(!isMaximized)
    await appWindow.setResizable(false);
    setOnHoverMaximize(false);
  };
  const close = () => {
    appWindow.close();
  };

  return (
    <div
      data-tauri-drag-region
      className='absolute left-0 top-0 z-50 flex h-[30px] w-screen items-center justify-end p-2'
      onMouseOver={() => handleOnHover(true)}
      onMouseOut={() => handleOnHover(false)}
    >
      {[
        [controlMinimize, minimize, 'minimize', onHoverMinimize, setOnHoverMinimize],
        [controlMaximize, maximize, 'fullscreen', onHoverMaximize, setOnHoverMaximize],
        [controlClose, close, 'close', onHoverClose, setOnHoverClose],
      ].map(([controls, onClick, icon, onHover, setOnHover], index) => (
        <motion.div
          key={index}
          className='ml-2 h-[24px] w-[24px] cursor-pointer'
          initial={{ opacity: 0.3 }}
          animate={controls as AnimationControls}
        >
          <Icon
            className={pathname === '/dialog' ? 'text-white' : 'text-black'}
            icon={`mingcute-${icon == 'fullscreen' && isMaximized ? 'restore' : icon}-${
              onHover ? 'fill' : 'line'
            }`}
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
    </div>
  );
}
