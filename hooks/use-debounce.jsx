"use client";

import { useRef } from "react";

const useDebounce = () => {
  const debounceTimeout = useRef(null);

  const debounce = (func, delay) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      func();
      debounceTimeout.current = null;
    }, delay);
  };

  return debounce;
};

export default useDebounce;
