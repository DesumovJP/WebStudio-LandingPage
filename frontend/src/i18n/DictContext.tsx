"use client";
import React, { createContext, useContext } from "react";
import type { Dictionary } from "./getDictionary";
import type { Locale } from "./config";

type Ctx = { locale: Locale; dict: Dictionary };
const DictContext = createContext<Ctx | null>(null);

export function DictProvider({ value, children }: { value: Ctx; children: React.ReactNode }) {
  return <DictContext.Provider value={value}>{children}</DictContext.Provider>;
}

export function useDict() {
  const ctx = useContext(DictContext);
  if (!ctx) throw new Error("useDict must be used within DictProvider");
  return ctx;
}


