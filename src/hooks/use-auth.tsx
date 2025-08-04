
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/admin')) {
      router.push('/login');
    }
     if (!loading && user && (pathname === '/login')) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  
  if (!user && pathname.startsWith('/admin')) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  
  if (user && (pathname === '/login')) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/admin')) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (!user && pathname.startsWith('/admin')) {
    return null;
  }


  return <>{children}</>;
};
