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

    useEffect(() => {
        const sessaoAtiva = auth.getUserSession();
        if(!sessaoAtiva){
            console.log("Token inválido, redirecionando para tela de login..");
            router.push("/login");
            return;
        }
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

    if (carregadoSessao) {
        return (
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white font-semibold">
                Verificando credenciais de acesso...
            </div>
        );
    }
    
    const itensMenu: CardMenu[] = [
        {
            id: 'restaurante',
            titulo: 'Restaurante',
            rota: '/restaurante',
            corEstilo: 'border-blue-500 hover:bg-green-50 text-orange-700 hover:scale-100',
            icone: <span className="text-4xl">🍽️</span>
        },
        {
            id: 'pontoTuristico',
            titulo: 'Ponto Turistico',
            rota: '/pontoTuristico',
            corEstilo: 'border-blue-500 hover:bg-green-50 text-orange-700 hover:scale-100',
            icone: <span className="text-4xl">🍽️</span>
        },
        {
            id: 'guia',
            titulo: 'Guias Turistico',
            rota: '/guia',
            corEstilo: 'border-blue-500 hover:bg-green-50 text-orange-700 hover:scale-100',
            icone: <span className="text-4xl">🍽️</span>
        }

    ];

    return (
        <Template>
            <div>
                <div className="mt-2 py-3 text-center">
                    <h2 className="font-bold lg-roudend">Painel Principal</h2>
                </div>
                <p className="text-center mt-2 ">Selecione uma opção</p>

                <div className="flex flex-col justify-center items-center gap-3 mt-10 w-full">
                    {itensMenu.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => router.push(item.rota)}
                            className={`cursor-pointer p-8 bg-white rounded-2xl border-2 shadow-sm transition-all duration-300 transform flex flex-col items-center justify-center text-center h-30 w-60 ${item.corEstilo}`}
                        >
                            <div className="mb-4">{item.icone}</div>
                            <h2 className="text-2xl font-bold tracking-tight">{item.titulo}</h2>
                        </div>
                    ))};


                </div>

            </div>
        </Template>
    );
}