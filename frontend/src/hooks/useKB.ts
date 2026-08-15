import { useContext } from 'react';
import { KBContext } from '../context/KBContext';
import type { KBContextType } from '../context/KBContext';

export const useKB = (): KBContextType => {
  const context = useContext(KBContext);
  if (!context) {
    throw new Error('useKB must be used within a KBProvider');
  }
  return context;
};
