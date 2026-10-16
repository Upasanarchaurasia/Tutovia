import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AuthLayout from './AuthLayout.jsx';
import AuthCard from './AuthCard.jsx';

export default function AuthContainerV2() {
  const location = useLocation();
  const isSignUp = location.pathname.includes('signup');
  const shouldReduceMotion = useReducedMotion();
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const triggerShake = () => {
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);
  };

  return (
    <AuthLayout activeTitle={isSignUp ? 'Sign Up' : 'Sign In'} showCarousel={true}>
      <AuthCard shake={shakeTrigger}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ 
              opacity: 0, 
              x: shouldReduceMotion ? 0 : (isSignUp ? 10 : -10) 
            }}
            animate={{ 
              opacity: 1, 
              x: 0 
            }}
            exit={{ 
              opacity: 0, 
              x: shouldReduceMotion ? 0 : (isSignUp ? -10 : 10) 
            }}
            transition={{ 
              duration: shouldReduceMotion ? 0.15 : 0.22, 
              ease: 'easeOut' 
            }}
            className="w-full h-full flex flex-col justify-between"
          >
            <Outlet context={{ triggerShake }} />
          </motion.div>
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
}
