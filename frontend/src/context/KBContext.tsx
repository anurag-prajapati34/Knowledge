import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { KnowledgeBase } from '../types';
import { kbApi } from '../api/kb';
import type { CreateKBPayload } from '../api/kb';
import { formatApiError } from '../api/client';
import { toast } from 'react-toastify';

export interface KBContextType {
  kbs: KnowledgeBase[];
  activeKB: KnowledgeBase | null;
  isLoading: boolean;
  fetchKBs: () => Promise<KnowledgeBase[]>;
  createKB: (payload: CreateKBPayload) => Promise<KnowledgeBase>;
  deleteKB: (id: number | string) => Promise<void>;
  setActiveKB: (kb: KnowledgeBase | null) => void;
}

export const KBContext = createContext<KBContextType | undefined>(undefined);

interface KBProviderProps {
  children: ReactNode;
}

export const KBProvider: React.FC<KBProviderProps> = ({ children }) => {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [activeKB, setActiveKB] = useState<KnowledgeBase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchKBs = useCallback(async (): Promise<KnowledgeBase[]> => {
    setIsLoading(true);
    try {
      const data = await kbApi.getKBs();
      setKbs(data);
      return data;
    } catch (err: any) {
      toast.error(formatApiError(err));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createKB = async (payload: CreateKBPayload): Promise<KnowledgeBase> => {
    try {
      const newKb = await kbApi.createKB(payload);
      setKbs((prev) => [newKb, ...prev]);
      toast.success(`Knowledge Base "${newKb.name}" created!`);
      return newKb;
    } catch (err: any) {
      const msg = formatApiError(err);
      toast.error(msg);
      throw err;
    }
  };

  const deleteKB = async (id: number | string): Promise<void> => {
    try {
      await kbApi.deleteKB(id);
      setKbs((prev) => prev.filter((kb) => String(kb.id) !== String(id)));
      if (activeKB && String(activeKB.id) === String(id)) {
        setActiveKB(null);
      }
      toast.success('Knowledge Base deleted successfully.');
    } catch (err: any) {
      toast.error(formatApiError(err) || 'Deleting Knowledge Base is not supported.');
      throw err;
    }
  };

  return (
    <KBContext.Provider
      value={{
        kbs,
        activeKB,
        isLoading,
        fetchKBs,
        createKB,
        deleteKB,
        setActiveKB,
      }}
    >
      {children}
    </KBContext.Provider>
  );
};

