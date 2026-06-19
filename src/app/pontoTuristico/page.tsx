'use client'
import { Button } from "@/componente/button/Button";
import { InputText } from "@/componente/input/InputText";
import { Template } from "@/componente/Template";
import { pontoTuristico } from "@/resources/pontoTuristico/authentication.pontoTuristico";
import { PontoTuristico } from "@/resources/pontoTuristico/pontoTuristico";
import { userAuth } from "@/resources/user/authenticatio.user";  
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { notification } from "@/componente/notification";

export default function PontoPage(){
    const notificationPonto = notification();
    const pontoService = pontoTuristico();
    const auth = userAuth();
    const [nome, setNome] = useState<string>('');
    const [listaPonto, setListaPonto] = useState<any[]>([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState<boolean>(true); 
    const router = useRouter();
    
    useEffect(() => {
        const sessaoAtiva = auth.getUserSession();
        if (!sessaoAtiva) {
            console.log("Acesso negado no componente! Redirecionando para o login...");
            router.push("/login");
            return;
        }
        setCarregandoSeguranca(false);
         async function buscarPontoTuristico() {
            try{
                let getPontoTuristico;

                if(!nome || nome.trim() != null){
                    getPontoTuristico = await pontoService.buscarPorNome(nome);
                }else{
                    getPontoTuristico = await pontoService.buscar();
                }
                console.log(getPontoTuristico, "Pontos");
                const lista = ((getPontoTuristico as any).content || []);
                setListaPonto(lista);
                if(lista.length === 0){
                    notificationPonto.notify("Nenhum Ponto Turistico encontrado!", "info")
                }

            }catch(error){
                console.log(error)
            }
        }buscarPontoTuristico();

    }, [nome])

    if (carregandoSeguranca) {
        return (
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white font-semibold">
                Verificando credenciais de acesso...
            </div>
        );
    }


    function renderizarTelaPonto(){
        if(listaPonto.length === 0){
            return <p className="col-span-3 text-gray-400 py-8 text-center w-full">Nenhum Ponto Turistico</p>
        };
        return listaPonto?.map((pontos: PontoTuristico, index: number) => {
            return(
                <div key={pontos.id || index} className="bg-gray-800 w-60 border border-gray-700 rounded-xl p-2 shadow-lg flex flex-col justify-between hover:border-green-500 transition-all duration-200"
                    >
            
                    <div>
                        <div className="h-32 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                            🍕
                        </div>
                        <h3 className="text-xl font-bold text-white text-left">{pontos.nome || 'Nome do Ponto Turistico'}</h3>
                        <p className="text-sm text-gray-400 text-left mt-1">📍 {pontos.informacoes || 'Descrição não informada'}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full">
                            {pontos.local || 'Local'}
                        </span>
            
                    </div>
                </div>    
            )
        })
    }
    
    return(
        <Template>
            <div className="w-full text-center mt-4">

                <div className="mt-5 py-3">
                    <h2 className="font-bold ">Pontos Turisticos</h2>
                </div>

                <div className="gap-3 mt-4 py-4 p-6 rounded-xl">
                    <section className="flex justify-center items-center gap-2 mt-2 py-4">
                        <InputText placeholder="Digite o Ponto Turistico" onChange={event => setNome(event.target.value)}/>

                        <Button type="submit" 
                            style="bg-blue-500 hover:bg-blue-300"
                            label="Pesquisar"/>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">   
                    {renderizarTelaPonto()}
                    </div>

                </div>
                
            </div>

        </Template>
    )
}