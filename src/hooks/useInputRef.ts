import { useEffect, useRef } from "react";

const useInputRef = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);
  return inputRef;
};

export default useInputRef;
