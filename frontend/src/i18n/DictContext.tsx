'use client';

import { createContext, useContext } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './getDictionary';

type DictValue = { locale: Locale; dict: Dictionary };

export const DictContext = createContext<DictValue>({ locale: 'uk', dict: {} });

export function DictProvider({ value, children }: { value: DictValue; children: React.ReactNode }) {
  return <DictContext.Provider value={value}>{children}</DictContext.Provider>;
}

export const useDict = () => useContext(DictContext);


