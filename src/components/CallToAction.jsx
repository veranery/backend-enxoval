import React from 'react';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <motion.h1
      className='text-xl md:text-2xl font-bold text-[#333333] leading-8 w-full text-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      Vamos transformar suas <span className="text-rosa">ideias</span> em <span className="text-amarelo">realidade</span>
    </motion.h1>
  );
};

export default CallToAction;