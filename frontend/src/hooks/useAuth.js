import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("mcc_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const signIn = ({ user, token }) => {
    localStorage.setItem("mcc_user", JSON.stringify(user));
    localStorage.setItem("mcc_token", token);
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("mcc_user");
    localStorage.removeItem("mcc_token");
    setUser(null);
  };

  return { user, signIn, signOut };
}
