'use client'
import { userAuth } from '@/resources/user/authenticatio.user';
import LoginPage from "@/app/page"
import PainelPage from './painel/page';

export default function Home() {
  const auth = userAuth();
  const user = auth.getUserSession();

  if(!user){
    return <LoginPage/>
  }

  return (
    <PainelPage/>
  )
}