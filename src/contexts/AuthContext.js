import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { auth } from "../config/firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);
  const backgroundTimeRef = useRef(null);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        backgroundTimeRef.current = Date.now();

        logoutTimerRef.current = setTimeout(async () => {
          if (auth.currentUser) {
            await signOut(auth);
          }
        }, 5 * 60 * 1000);
      } else if (nextAppState === "active") {

        if (backgroundTimeRef.current) {
          const elapsed = Date.now() - backgroundTimeRef.current;
          const limit = 5 * 60 * 1000;

          if (elapsed >= limit) {
            signOut(auth);
          }
        }

        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
          logoutTimerRef.current = null;
        }
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    return userCredential;
  };


  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

