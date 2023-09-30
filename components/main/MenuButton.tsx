'use client';

import { motion } from 'framer-motion';

import Link from 'next/link';

export default function MenuButton({ children, href }: { children: string; href: string }) {
  return (
    <motion.section
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className='mt-5 flex w-screen cursor-pointer justify-center'
    >
      <div
        className={`absolute z-0 mt-4 w-${32 - (4 - children.length) * 4} border-t-2 border-black`}
      />
      <div className={`absolute z-10 mt-4 h-3 w-${28 - (4 - children.length) * 4} bg-white`} />
      <Link href={href} className='z-20'>
        <div className='text-[1.3em]'>{children}</div>
      </Link>
    </motion.section>
  );
}
