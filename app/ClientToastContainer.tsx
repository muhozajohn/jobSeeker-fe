'use client';

import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

export function ClientToastContainer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ToastContainer position="bottom-right" />;
}