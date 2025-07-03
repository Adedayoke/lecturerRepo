// Modal.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  cloneElement,
  ReactNode,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";

import { useOutsideClick } from "@/hooks/useClickOutside";
import Overlay from "./Overlay";
import { X } from "lucide-react";

interface ModalContextType {
  modalName: string;
  open: (name: string) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal provider");
  }
  return context;
}

function Modal({ children }: { children: ReactNode }) {
  const [modalName, setModalName] = useState("");

  const open = (name: string) => setModalName(name);
  const close = () => setModalName("");

  return (
    <ModalContext.Provider value={{ modalName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

type ModalWindowProps = {
  name: string;
  className?: string;
  buttonClass?: string;
  children: ReactNode;
};

function ModalWindow({ name, className = "", buttonClass = "", children }: ModalWindowProps) {
  const { modalName, close } = useModalContext();
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== modalName) return null;

  return createPortal(
    <Overlay>
      <div ref={ref} className={className}>
        <button onClick={close} className={buttonClass}>
          <X size={20} />
        </button>
        {typeof children === "object" && "type" in (children as any)
          ? cloneElement(children as ReactElement<any>, { onCloseModal: close })
          : children}
      </div>
    </Overlay>,
    document.body
  );
}

type ModalOpenerProps = {
  opensModalName: string;
  children: ReactElement<any, any>;
};

function ModalOpener({ opensModalName, children }: ModalOpenerProps) {
  const { open } = useModalContext();

  return cloneElement(children, {
    onClick: () => open(opensModalName),
  });
}

Modal.ModalWindow = ModalWindow;
Modal.ModalOpener = ModalOpener;

export default Modal;
