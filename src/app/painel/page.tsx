'use client'
import { userAuth } from "@/resources/user/authenticatio.user";
import { useEffect, useState } from 'react';
import { CardMenu } from "@/resources/painel/painel.resources";
import { useRouter } from 'next/navigation'
import { Template } from "@/componente/Template";


export default function painelPage(){
    const auth = userAuth();
    const router = useRouter();
    const [carregadoSessao, setCarregandoSessao] = useState(true);

    useEffect(() => {
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
    
    const itensMenu: CardMenu[] = [
        {
            id: 'restaurante',
            titulo: 'Restaurante',
            rota: '/restaurante',
            corEstilo: 'border-orange-500 hover:bg-orange-50 text-orange-700 hover:scale-105',
            icone: <span className="text-4xl">🍽️</span>
        },
        {
            id: 'pontoTuristico',
            titulo: 'Ponto Turistico',
            rota: '/pontoTuristico',
            corEstilo: 'border-orange-500 hover:bg-orange-50 text-orange-700 hover:scale-105',
            icone: <span className="text-4xl">🍽️</span>
        }

    ];

    return (
        <Template>
            <div>
                <div className="mt-2 py-3 ">
                    <h2 className="font-bold lg-roudend">Painel Principal</h2>
                </div>
                <p>Selecione uma opção</p>

                <div>
                    {itensMenu.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => router.push(item.rota)}
                            className={`cursor-pointer p-8 bg-white rounded-2xl border-2 shadow-sm transition-all duration-300 transform flex flex-col items-center justify-center text-center h-48 ${item.corEstilo}`}
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