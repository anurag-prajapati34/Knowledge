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
  fetchKB: (id: number | string) => Promise<KnowledgeBase>;
  createKB: (payload: CreateKBPayload) => Promise<KnowledgeBase>;
  updateKB: (id: number | string, payload: CreateKBPayload) => Promise<KnowledgeBase>;
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

  const fetchKB = useCallback(async (id: number | string): Promise<KnowledgeBase> => {
    setIsLoading(true);
    try {
      const data = await kbApi.getKB(id);
      setActiveKB(data);
      return data;
    } catch (err: any) {
      toast.error(formatApiError(err));
      throw err;
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

  const updateKB = async (id: number | string, payload: CreateKBPayload): Promise<KnowledgeBase> => {
    try {
      const updatedKb = await kbApi.updateKB(id, payload);
      setKbs((prev) => prev.map((kb) => (String(kb.id) === String(id) ? updatedKb : kb)));
      if (activeKB && String(activeKB.id) === String(id)) {
        setActiveKB(updatedKb);
      }
      toast.success('Knowledge Base updated successfully.');
      return updatedKb;
    } catch (err: any) {
      toast.error(formatApiError(err));
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
      toast.error(formatApiError(err));
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
        fetchKB,
        createKB,
        updateKB,
        deleteKB,
        setActiveKB,
      }}
    >
      {children}
    </KBContext.Provider>
  );
};
