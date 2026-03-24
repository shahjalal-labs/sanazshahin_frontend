"use client";

import { useEffect } from "react";

export const AuthSync = () => {
  useEffect(() => {
    // This project currently doesn't install next-auth. Keep the component
    // mounted as a no-op so existing imports won't break builds.
    localStorage.removeItem("googleSignIn");
  }, []);

  return null;
};
