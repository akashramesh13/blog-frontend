import { useEffect, useRef } from "react";

const useInputRef = <T extends HTMLElement = HTMLInputElement>() => {
  const inputRef = useRef<T>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);
  return inputRef;
};

export default useInputRef;
