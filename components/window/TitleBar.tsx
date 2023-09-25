'use client';

import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify-icon/react';
import { motion } from 'framer-motion';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [onHoverMinimize, setOnHoverMinimize] = useState(false);
  const [onHoverMaximize, setOnHoverMaximize] = useState(false);
  const [onHoverClose, setOnHoverClose] = useState(false);

  const [onHover, setOnHover] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMaximized) {
      if (onHover) {
        document.getElementById('titlebar')?.classList.remove('opacity-0');
      } else {
        timer = setTimeout(() => {
          document.getElementById('titlebar')?.classList.add('opacity-0');
        }, 5000);
      }
    }
    return () => clearTimeout(timer);
  }, [onHover]);

  const handleOnHover = (boolean: boolean) => {
    if (isMaximized) setOnHover(boolean);
  };
  const minimize = () => {
    setOnHoverMinimize(false);
    appWindow.minimize();
  };
  const maximize = async () => {
    await appWindow.toggleMaximize();
    setIsMaximized((prev) => !prev);
    await setOnHoverMaximize(false);
  };
  const close = () => {
    appWindow.close();
  };

  return (
    <div
      id='titlebar'
      className={`${
        isMaximized && 'absolute'
      } w-screen h-[30px] bg-white flex justify-end items-center p-2 pb-4 border-b-[1px] border-stone-500`}
      onMouseOver={() => handleOnHover(true)}
      onMouseOut={() => handleOnHover(false)}
    >
      {[
        [minimize, 'minimize', onHoverMinimize, setOnHoverMinimize],
        [maximize, 'fullscreen', onHoverMaximize, setOnHoverMaximize],
        [close, 'close', onHoverClose, setOnHoverClose],
      ].map(([onClick, icon, onHover, setOnHover], index) => (
        <Icon
          id='titlebar-button'
          key={index}
          className='cursor-pointer ml-1'
          icon={`mingcute-${index === 1 && isMaximized ? 'restore' : icon}-${
            onHover ? 'fill' : 'line'
          }`}
          onClick={onClick as () => void}
          onMouseOver={
            typeof setOnHover === 'function'
              ? () => setOnHover(true)
              : undefined
          }
          onMouseOut={
            typeof setOnHover === 'function'
              ? () => setOnHover(false)
              : undefined
          }
          style={{ fontSize: '28px' }}
        />
      ))}
    </div>
  );
}
