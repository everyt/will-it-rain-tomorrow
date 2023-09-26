'use client';

import { appWindow } from '@tauri-apps/api/window';
import { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import { motion } from 'framer-motion';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [onHoverMinimize, setOnHoverMinimize] = useState(false);
  const [onHoverMaximize, setOnHoverMaximize] = useState(false);
  const [onHoverClose, setOnHoverClose] = useState(false);

  const handleOnHover = (boolean: boolean) => {
    if (!boolean) {
      setOnHoverMinimize(false);
      setOnHoverMaximize(false);
      setOnHoverClose(false); // 이벤트 감지를 못 할때가 있음, 초기화. motion도 그래서 못씀.
    }
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
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      id='titlebar'
      data-tauri-drag-region
      className={`${
        isMaximized && 'absolute'
      } w-screen h-[30px] bg-white flex justify-end items-center p-2 border-b-[1px] border-stone-500`}
      onMouseOver={() => handleOnHover(true)}
      onMouseOut={() => handleOnHover(false)}
    >
      {[
        [minimize, 'minimize', onHoverMinimize, setOnHoverMinimize],
        [maximize, 'fullscreen', onHoverMaximize, setOnHoverMaximize],
        [close, 'close', onHoverClose, setOnHoverClose],
      ].map(([onClick, icon, onHover, setOnHover], index) => (
        <Icon
          key={index}
          className='cursor-pointer ml-[1px]'
          icon={`mingcute-${index === 1 && isMaximized ? 'restore' : icon}-${
            onHover ? 'fill' : 'line'
          }`}
          onClick={onClick as () => void}
          onMouseEnter={
            typeof setOnHover === 'function'
              ? () => setOnHover(true)
              : undefined
          }
          onMouseLeave={
            typeof setOnHover === 'function'
              ? () => setOnHover(false)
              : undefined
          }
          style={{ fontSize: '24px' }}
        />
      ))}
    </motion.div>
  );
}
