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
    const [avaliar, setAvaliar] = useState< PontoTuristico  |  null >(null);
    const [nome, setNome] = useState< string >('');
    const [listaPonto, setListaPonto] = useState< any []>([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState< boolean >(true);
    const [notaDigitada, setNotaDigitada] = useState< string >('');
    const [comentarioDigitado, setComentarioDigitado] = useState< string >('');
    const router = useRouter();

    useEffect(() => {
        const sessaoAtiva = auth.getUserSession();
        if (!sessaoAtiva) {
            console.log("Acesso negado no componente! Redirecionando para o login...");
            router.push("/login");
            return;
        }
        setCarregandoSeguranca(false);
        if(carregandoSeguranca) return;
        async function buscarPontoTuristico() {
            try{
                let getPontoTuristico;
                if(nome && nome.trim() !== ""){
                    getPontoTuristico = await pontoService.buscarPorNome(nome);
                }else{
                    getPontoTuristico = await pontoService.buscar();
                }
                console.log(getPontoTuristico, "Pontos");
                const lista = Array.isArray(getPontoTuristico)
                ? getPontoTuristico
                : (getPontoTuristico?.content || []);
                setListaPonto(lista);
                if(lista.length === 0){
                    notificationPonto.notify("Nenhum Ponto Turistico encontrado!", "info")
                }
            }catch(error){
                console.log(error)
            }
        }buscarPontoTuristico();
    }, [nome, carregandoSeguranca])

    if (carregandoSeguranca) {
        return (
            <div  className ="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#1A5F7A] font-semibold">
                Verificando credenciais de acesso...
            </div>
        );
    }

    function renderizarTelaPonto(){
        if(listaPonto.length === 0){
            return <p  className ="col-span-3 text-gray-500 py-8 text-center w-full">Nenhum Ponto Turístico encontrado</p>
        };
        return (
            <>
            {listaPonto?.map(( pontos : PontoTuristico,  index :  number ) => {
                const linkMapaCoords = ( pontos .latitude &&  pontos .longitude)
                ? `https://www.google.com/maps?q=${ pontos .latitude},${ pontos .longitude}`
                : null;
                return(
                    <div  key ={ pontos .id ||  index }  className ="bg-white w-60 border border-[#EADCC9] rounded-xl p-3 shadow-md flex flex-col justify-between hover:border-[#C05C32] transition-all duration-200">
                        <div>
                            <div  className ="h-32 w-full bg-[#E3F2FD] rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                                🗿
                            </div>
                            <h3  className ="text-xl font-bold text-[#1A5F7A] text-left">{ pontos .nome || 'Nome do Ponto Turistico'}</h3>
                            <p  className ="text-sm text-gray-600 text-left mt-1">📍 { pontos .informacoes || 'Descrição não informada'}</p>
                        </div>
                        <div  className ="mt-4 flex items-center justify-between">
                            <span  className ="text-xs bg-[#C05C32]/10 text-[#C05C32] font-semibold px-2.5 py-1 rounded-full">
                                { pontos .local || 'Local'}
                            </span>
                        </div>
                        <div  className ="mt-4 flex gap-2">
                            {linkMapaCoords && (
                                <a
                                    href ={linkMapaCoords}
                                    target ="_blank"
                                    rel ="noopener noreferrer"
                                    className ="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-2 rounded-lg text-xs transition-colors border border-gray-200"
                                    title ="Ver no Mapa"
                                >
                                    🗺️ Mapa
                                </a>
                            )}
                        </div>
                    </div>
                )
            })};
            {avaliar && (
                <div  className ="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div  className ="bg-white border border-[#EADCC9] p-6 rounded-xl w-80 text-gray-800 shadow-2xl">
                        <h3  className ="text-lg font-bold text-[#1A5F7A]">Avaliar {avaliar?.nome}</h3>
                        <p  className ="text-xs text-gray-500 mt-1">Dê sua nota de 0 a 10 e deixe um comentário.</p>

                        <div  className ="mt-4">
                            <label  className ="text-xs text-gray-500 block mb-1">Nota:</label>
                            <input
                                type ="number"  min ="0"  max ="10"  step ="0.1"  placeholder ="Ex: 9.5"  value ={notaDigitada}
                                onChange ={( event  => setNotaDigitada( event .target.value))}
                                className ="w-full bg-gray-50 border border-[#EADCC9] rounded p-1.5 text-gray-800 outline-none focus:border-[#57C5B6] text-sm"
                            />
                        </div>

                        <div  className ="mt-3">
                            <label  className ="text-xs text-gray-500 block mb-1">Comentário:</label>
                            <textarea
                                placeholder ="O que você achou do Ponto Turistico?"
                                className ="w-full bg-gray-50 border border-[#EADCC9] rounded p-1.5 text-gray-800 h-20 resize-none text-sm outline-none focus:border-[#57C5B6]"
                                value ={comentarioDigitado}
                                onChange ={( event ) => setComentarioDigitado(event.target.value)} />
                        </div>

                        <div  className ="mt-5 flex gap-2 justify-end text-xs">
                            <button
                                onClick ={() => {
                                    setAvaliar(null);
                                    setNotaDigitada('');
                                    setComentarioDigitado('');
                                }}
                                className ="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick ={() => {
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
                                className ="px-4 py-2 bg-[#C05C32] text-white rounded-lg hover:bg-[#A84A24] font-semibold transition-colors cursor-pointer"
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </>
        );
    }

    return(
        < Template >
        <div  className ="w-full text-center mt-4 bg-[#FDFBF7] min-h-screen pb-12 text-gray-800">
            <div  className ="mt-5 py-3">
                <h2  className ="font-bold text-3xl text-[#1A5F7A]">Pontos Turísticos</h2>
            </div>

            <div  className ="gap-3 mt-4 py-4 p-6 rounded-xl">
                <section  className ="flex justify-center items-center gap-2 mt-2 py-4 max-w-xl mx-auto bg-white p-4 rounded-2xl border border-[#EADCC9] shadow-sm">
                    < InputText   placeholder ="Digite o Ponto Turistico"  onChange ={ event  => setNome(event.target.value)}  className ="border-[#EADCC9] focus:border-[#57C5B6]" />
                    < Button   type ="submit"
                        style ="bg-[#1A5F7A] hover:bg-[#124559] text-white font-semibold"
                        label ="Pesquisar"/>
                </section>

                <div  className ="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8 justify-items-center">
                    {renderizarTelaPonto()}
                </div>
            </div>
        </div>
        </ Template >
    )
}