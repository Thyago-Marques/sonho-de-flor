
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading, firestore } = useFirebase();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is resolved
    }
    if (!user) {
      router.push('/admin/login'); // Redirect if not logged in
      return;
    }

    // Check for admin role
    const checkAdmin = async () => {
      const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
      const adminRoleSnap = await getDoc(adminRoleRef);
      if (!adminRoleSnap.exists()) {
        // Not an admin, redirect to login (or a "not authorized" page)
        router.push('/admin/login');
      }
    };

    checkAdmin();
  }, [user, isUserLoading, firestore, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verificando autorização...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseClientProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </FirebaseClientProvider>
    )
}
