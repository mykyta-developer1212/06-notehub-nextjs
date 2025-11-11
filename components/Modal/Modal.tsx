"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = originalOverflow; 
    };
  }, [onClose]);

  if (typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root") ?? document.body;

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={onBackdropClick}>
      <div style={{ background: "white", padding: "1rem", margin: "5% auto", maxWidth: "500px" }}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}