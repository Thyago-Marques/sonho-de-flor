
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading, firestore } = useFirebase();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is resolved
    }
    if (!user) {
      router.replace('/admin/login'); // Redirect if not logged in
      return;
    }

    // Check for admin role
    const checkAdmin = async () => {
      if (!firestore) return;
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      const adminRoleSnap = await getDoc(adminRoleRef);
      if (!adminRoleSnap.exists()) {
        // Not an admin, redirect to login (or a "not authorized" page)
        router.replace('/admin/login');
      }
    };

    checkAdmin();
  }, [user, isUserLoading, firestore, router]);

  // While checking, show a loading state
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verificando autorização...</p>
      </div>
    );
  }

  // If checks pass, render the protected content
  return <>{children}</>;
}
