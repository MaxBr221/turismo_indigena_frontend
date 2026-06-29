'use client'
import { userAuth } from "@/resources/user/authenticatio.user";
import { useEffect, useState } from 'react';
import { CardMenu } from "@/resources/painel/painel.resources";
import { useRouter } from 'next/navigation'
import { Template } from "@/componente/Template";

export default function PainelPage(){
    const auth = userAuth();
    const router = useRouter();
    const [carregadoSessao, setCarregandoSessao] = useState(true);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        setCarregandoSessao(false);
        try{
            const sessaoAtiva = auth.getUserSession();
            console.log("token: ", sessaoAtiva);
            if(!sessaoAtiva){
                console.log("token inválido");
                router.push("/login");
            }
            else{
                setCarregandoSessao(false)
            }
        }catch(error){
            console.error("Erro ao entrar no painel")
        }
    },[auth, router]);

    const lidarComSair = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("_auth");
        }
        router.push("/login");
    };

    if (carregadoSessao) {
        return (
            <div  className ="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#1A5F7A] font-semibold">
                Verificando credenciais de acesso...
            </div>
        );
    }

    const itensMenu:  CardMenu [] = [
        {
            id: 'restaurante',
            titulo: 'Restaurante',
            rota: '/restaurante',
            corEstilo: 'border-[#EADCC9] hover:border-[#C05C32] text-[#1A5F7A] hover:bg-[#FDFBF7]',
            icone: <span  className ="text-4xl">🍽️</span>
        },
        {
            id: 'pontoTuristico',
            titulo: 'Ponto Turístico',
            rota: '/pontoTuristico',
            corEstilo: 'border-[#EADCC9] hover:border-[#C05C32] text-[#1A5F7A] hover:bg-[#FDFBF7]',
            icone: <span  className ="text-4xl">🏛️</span>
        },
        {
            id: 'guia',
            titulo: 'Guias Turísticos',
            rota: '/guia',
            corEstilo: 'border-[#EADCC9] hover:border-[#C05C32] text-[#1A5F7A] hover:bg-[#FDFBF7]',
            icone: <span  className ="text-4xl">🧭</span>
        }
    ];

    return (
    <Template>
        <div className="bg-[#FDFBF7] text-gray-800 px-6 pt-10 max-w-4xl mx-auto">
            
            {/* Cabeçalho Interno do Painel (O botão de menu agora fica acima, no Header) */}
            <div className="text-center mb-12">
                <h2 className="font-black text-3xl text-[#1A5F7A] uppercase tracking-tight">
                    Painel Principal
                </h2>
                <p className="text-gray-500 font-medium mt-2">
                    Selecione uma opção para começar sua jornada pelas aldeias e praias
                </p>
            </div>
            
            {/* Grid de Cards reorganizados de forma harmônica e responsiva */}
            <div className="grid grid-cols-1 py-5 md:grid-cols-3 gap-8 w-full justify-items-center">
                {itensMenu.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => router.push(item.rota)}
                        className={`cursor-pointer p-10 rounded-[2.5rem] border-2 shadow-sm transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center h-44 w-64 group bg-white ${item.corEstilo}`}
                    >
                        <div className="mb-4 transform group-hover:scale-110 transition-transform">
                            {item.icone}
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">
                            {item.titulo}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    </Template>
);
}