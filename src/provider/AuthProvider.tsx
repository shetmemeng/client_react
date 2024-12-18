import React, { createContext, useContext, useEffect, useState } from 'react';

interface ISessionData {
    token: string | null;
    user: IUser | null;
    status?: string;
}

interface IUser {
    id: string;
    role: "ADMIN" | "USER";
}
  
const AuthContext = createContext<{
  session: ISessionData,
  login: (token: string, user: IUser) => void,
  logout: () => void,
  loading: boolean | null
}>({
  session: {token: null, user: null},
  login: () => {},
  logout: () => {},
  loading: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ISessionData>({
    token: null,
    user: null
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    setSession({
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null
    })
    setLoading(false)
  }, []);

  const login = (token: string, user: IUser) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setSession({ token, user});
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession({ token: null, user: null});
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
