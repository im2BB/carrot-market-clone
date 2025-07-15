"use client";

import { ThemeProvider } from "./theme-provider";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
