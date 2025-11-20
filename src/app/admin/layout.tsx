
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseClientProvider>
            {children}
        </FirebaseClientProvider>
    )
}
