'use client'
import { Template } from "@/componente/Template";
import { userAuth } from "@/resources/user/authenticatio.user"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function UserPage(){
    const useAuth = userAuth();
    const router = useRouter();
    const [user, setUser] = useState< any >(null);
    const [carregando, setCarregado] = useState(true);

    useEffect(() => {
        try{
            const sessaoAtiva = useAuth.getUserSession();
            if(!sessaoAtiva){
                console.log("Usuário não autenticado!");
                router.push("/login");
            }else{
                setUser(sessaoAtiva);
                setCarregado(false);
            }
        }catch(error){
            console.error("Erro ao ir para page de user.", error);
            throw error;
        }
    },[router])

    if(carregando){
        return(
            <p  className ="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#1A5F7A] font-semibold">
                Carregando os dados do perfil!
            </p>
        )
    }

    return(
        < Template >
        <div  className ="bg-[#FDFBF7] min-h-screen p-4 pb-12 relative text-gray-800">

            <div  className ="bg-white rounded-2xl border border-[#EADCC9] shadow-sm overflow-hidden mt-12">
                {/* Banner decorativo superior do card */}
                <div  className ="h-32 bg-gradient-to-r from-[#1A5F7A] to-[#57C5B6]" />

                {/* Área da foto e informações básicas */}
                <div  className ="p-6 relative pt-14 text-left">
                    {/* Avatar/Ícone redondo flutuando na borda do banner */}
                    <div  className ="absolute -top-12 left-6 w-24 h-24 bg-[#C05C32] border-4 border-white rounded-full flex items-center justify-center text-4xl shadow-sm text-white select-none">
                        👤
                    </div>

                    <div>
                        <h1  className ="text-3xl font-bold text-[#1A5F7A]">
                            {user?.nome|| "Nome do Usuário"}
                        </h1>
                        <p  className ="text-gray-500 text-sm mt-1">
                            📧 Usuário: {user?.login || "usuario@email.com"}
                        </p>
                        <span  className ="mt-3 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Cliente Ativo
                        </span>
                    </div>
                </div>

                {/* Abas de Informações Adicionais */}
                <div  className ="border-t border-gray-100 p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div  className ="bg-white p-4 rounded-xl border border-[#EADCC9]">
                        <h3  className ="font-semibold text-gray-700 mb-1">Tipo de Conta</h3>
                        <p  className ="text-gray-600 text-sm">Viajante / Turista</p>
                    </div>
                    <div  className ="bg-white p-4 rounded-xl border border-[#EADCC9]">
                        <h3  className ="font-semibold text-gray-700 mb-1">ID do Usuário</h3>
                        <p  className ="text-gray-600 text-sm font-mono">{user?.expiracao ? `${user.expiracao}s` : "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* SEÇÃO EXTRA FUTURA: Minhas Avaliações */}
            <div  className ="mt-8 bg-white rounded-2xl border border-[#EADCC9] shadow-sm p-6 text-left">
                <h2  className ="text-xl font-bold text-[#1A5F7A] mb-4 flex items-center gap-2">
                    ⭐ Minhas Avaliações Recentes
                </h2>
                <p  className ="text-gray-500 text-sm italic">
                    Em breve você poderá ver o histórico de todos os restaurantes e pontos turísticos que você avaliou aqui!
                </p>
            </div>
        </div>
        </ Template >
    )
}