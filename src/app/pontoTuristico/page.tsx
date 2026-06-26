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
import { authAvaliacao } from '@/resources/avaliacao/authentication.avaliacao';

export default function PontoPage(){
    const notificationPonto = notification();
    const pontoService = pontoTuristico();
    const auth = userAuth();
    const avaliacaoService = authAvaliacao(notificationPonto);
    const [avaliar, setAvaliar] = useState<PontoTuristico | null>(null);
    const [nome, setNome] = useState<string>('');
    const [listaPonto, setListaPonto] = useState<any[]>([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState<boolean>(true);
    const [notaDigitada, setNotaDigitada] = useState<string>('');
    const [comentarioDigitado, setComentarioDigitado] = useState<string>(''); 
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
        return (
            <>
            {listaPonto?.map((pontos: PontoTuristico, index: number) => {
            const linkMapaCoords = (pontos.latitude && pontos.longitude)
                ? `https://www.google.com/maps?q=${pontos.latitude},${pontos.longitude}`
                : null;
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
                    <div className="mt-4 flex gap-2">
                         {linkMapaCoords && (
                            <a
                                href={linkMapaCoords}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-1.5 px-2 rounded-lg text-xs transition-colors"
                                title="Ver no Mapa"
                            >
                                🗺️ Mapa
                            </a>
                        )}

                    </div>
                </div>    
            )
        })};
        {avaliar && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-80 text-white shadow-2xl">
                        <h3 className="text-lg font-bold">Avaliar {avaliar?.nome}</h3>
                        <p className="text-xs text-gray-400 mt-1">Dê sua nota de 0 a 10 e deixe um comentário.</p>

                        <div className="mt-4">
                            <label className="text-xs text-gray-400 block mb-1">Nota:</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="10" 
                                step="0.1"
                                placeholder="Ex: 9.5"
                                value={notaDigitada}
                                onChange={(event => setNotaDigitada(event.target.value))}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white outline-none focus:border-blue-500 text-sm" 
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-xs text-gray-400 block mb-1">Comentário:</label>
                            <textarea 
                                placeholder="O que você achou do Ponto Turistico?"
                                className="w-full bg-gray-700 border border-gray-600 rounded p-1.5 text-white h-20 resize-none text-sm outline-none focus:border-blue-500" 
                                value={comentarioDigitado}
                                onChange={(event) => setComentarioDigitado(event.target.value)} />
                        </div>

                        <div className="mt-5 flex gap-2 justify-end text-xs">
                            <button 
                                onClick={() => {
                                    setAvaliar(null); // Fecha a modal
                                    // 🧹 Limpa os campos para a próxima avaliação
                                    setNotaDigitada('');
                                    setComentarioDigitado('');
                                }}
                                className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {

                                    const notaEmNumero = parseFloat(notaDigitada);
                                    if (isNaN(notaEmNumero) || notaEmNumero < 0 || notaEmNumero > 10) {
                                        notificationPonto.notify("Por favor, digite uma nota válida entre 0 e 10.", "warning")
                                        return;
                                    }
                                    if (!avaliar || !avaliar.id) {
                                        alert("Erro: Não foi possível identificar o ID do Ponto Turistico.");
                                        return;
                                    }
                                    avaliacaoService.avaliarPontoTuristico(avaliar.id, notaEmNumero, comentarioDigitado)
                                    console.log("Enviando avaliação para o Ponto Turistico ID:", avaliar?.id);
                                    setAvaliar(null);
                                    setNotaDigitada('');
                                    setComentarioDigitado('');
                                }}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 font-semibold transition-colors cursor-pointer"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )};
        </>
        );
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