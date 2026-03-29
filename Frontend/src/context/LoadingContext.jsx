import React, { createContext, useEffect, useMemo, useState } from "react";

/** Global loading context exposing whether any tracked API request is in progress. */
export const LoadingContext = createContext(null);

/**
 * Tracks application-wide request activity through custom window events.
 */
export function LoadingProvider({ children }) {
  const [requests, setRequests] = useState(0);

  useEffect(() => {
    const start = () => setRequests((current) => current + 1);
    const end = () => setRequests((current) => Math.max(0, current - 1));

    window.addEventListener("app:loading:start", start);
    window.addEventListener("app:loading:end", end);

    return () => {
      window.removeEventListener("app:loading:start", start);
      window.removeEventListener("app:loading:end", end);
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading: requests > 0,
    }),
    [requests],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
