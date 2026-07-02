'use client'
import { userAuth } from '@/resources/user/authenticatio.user';
import PainelPage from './painel/page';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function Home() {
  const auth = userAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = auth.getUserSession();
    if (!session) {
      // 🚀 REDIRECIONA PARA A SUA ROTA DE LOGIN REAL
      router.push('/login'); 
    } else {
      setUser(session);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FDFBF7]">
        <p className="text-gray-500 animate-pulse font-semibold">Carregando...</p>
      </div>
    );
  }

  return <PainelPage />;
}