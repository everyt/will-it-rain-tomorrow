'use client';

import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';

export default function MainButton({ children, href }: { children: string; href: string }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(href);
  }
  return (
    <motion.section
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className='mt-5 flex w-screen justify-center'
      onClick={handleClick}
    >
      <div className='text-[1.3em]'>{children}</div>
    </motion.section>
  );
}
