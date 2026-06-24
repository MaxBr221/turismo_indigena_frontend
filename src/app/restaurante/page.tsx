'use client'
import {Template} from '@/componente/Template'
import { Button } from '@/componente/button/Button'
import { InputText } from "@/componente/input/InputText";
import { useEffect, useState } from 'react';
import { restaurantes } from '@/resources/restaurante/authentication.restaurante';
import { Formik, useFormik } from 'formik';
import { Restaurante } from '@/resources/restaurante/restaurante.resource';
import { userAuth } from '@/resources/user/authenticatio.user';
import { useRouter } from "next/navigation";
import { notification } from "@/componente/notification";
import { authAvaliacao } from '@/resources/avaliacao/authentication.avaliacao';

export default function RestaurantePage(){
    const notificationRest = notification();
    const restauranteService = restaurantes();
    const avaliacao = authAvaliacao();
    const router = useRouter();
    const auth = userAuth();
    const [avaliar, setAvaliar] = useState<Restaurante | null>(null);
    const [nome, setNome] = useState<string>('');
    const [restaurante, setRestaurante] = useState<any[]>([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState<boolean>(true); 
    const [notaDigitada, setNotaDigitada] = useState<string>('');
    const [comentarioDigitado, setComentarioDigitado] = useState<string>('');

    useEffect(() => {
        const sessaoAtiva = auth.getUserSession();
        if(!sessaoAtiva){
            console.log("Token invalido, redirecionando para login");
            router.push("/login");
            return;
        }
        setCarregandoSeguranca(false);
        async function buscarRestaurante(){
            try{
                let getRestaurantes;

                 if (nome && nome.trim() !== "") {
                    getRestaurantes = await restauranteService.buscarUnidade(nome);
                }else{
                    getRestaurantes = await restauranteService.busca();
                }
                console.log(getRestaurantes, "restaurantes");
                const lista = Array.isArray(getRestaurantes) 
                ? getRestaurantes 
                : (getRestaurantes?.content || []);
                setRestaurante(lista);

                if(lista.length === 0){
                    console.log(lista)
                    notificationRest.notify('Nenhum Restaurante encontrado!','info');
                }

            }catch(error){
                console.error("Erro ao buscarRestaurantes: ", error);
            }
                
        }const delayDebounce = setTimeout(() => {
            buscarRestaurante();
        }, 400);

        return () => clearTimeout(delayDebounce);

    }, [nome]);
    async function buscarPorBusca(nome: string) {
        try{
            const listRestaurante = await restauranteService.buscarUnidade(nome);
            console.log(listRestaurante, "todos restaurantes");
            const listaDeTodos = (listRestaurante as any || []);
            setNome(listaDeTodos);
            if(listRestaurante.length === 0){
                notificationRest.notify("Restaurante não encontrado!", "info");
            }

        }catch(error){
            console.error("Erro na busca dinamica", error);
        }
        
    }
    if(carregandoSeguranca){
        return(
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white font-semibold">
                Verificando credenciais de acesso...
            </div>
        )
    }

    
    function renderizarRestaurantes() {
    if (restaurante.length === 0) {
        return <p className="text-gray-400 text-center col-span-full">Nenhum restaurante disponível nesta região.</p>;
    }

    return (
        <>
            {restaurante?.map((rest: Restaurante, index: number) => {
                const linkMapaCoords = (rest.latitude && rest.longitude)
                    ? `http://googleusercontent.com/maps.google.com/?q=${rest.latitude},${rest.longitude}`
                    : null;
                
                const numeroLimpo = rest.telefone ? rest.telefone.replace(/\D/g, '') : '';
                const linkWhats = `https://wa.me/${numeroLimpo}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20restaurante%20${encodeURIComponent(rest.nome || '')}`;
                
                return (
                    <div key={rest.id || index} className="bg-gray-800 w-60 border border-gray-700 rounded-xl p-2 shadow-lg flex flex-col justify-between hover:border-green-500 transition-all duration-200">
                        <div>
                            <div className="h-32 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                                🍕
                            </div>
                            <h3 className="text-xl font-bold text-white text-left">{rest.nome || 'Nome do Restaurante'}</h3>
                            <p className="text-sm text-gray-400 text-left mt-1">📍 {rest.descricao || 'Descrição não informada'}</p>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full">
                                {rest.localizacao || 'Local'}
                            </span>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                            {linkMapaCoords && (
                                <a
                                    href={linkMapaCoords}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-1.5 px-2 rounded-lg text-xs transition-colors flex items-center justify-center"
                                    title="Ver no Mapa"
                                >
                                    🗺️ Mapa
                                </a>
                            )}

                            {rest.telefone && (
                                <a
                                    href={linkWhats}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-green-600 hover:bg-green-500 text-white font-medium py-1.5 px-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                                    title="Chamar no WhatsApp"
                                >
                                    <span>💬</span> WhatsApp
                                </a>
                            )}

                            <button
                                onClick={() =>  {
                                    console.log("📌 O que veio do Java neste restaurante?", rest);
                                    setAvaliar(rest)}} // 🔥 Altera o estado global da página
                                className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-1 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                title="Avaliar Restaurante"
                            >
                                <span>⭐</span> Avaliar
                            </button>
                        </div>
                    </div> 
                );
            })}

            {/* 2️⃣ MODAL FLUTUANTE ÚNICA (Fora do .map, mas dentro do retorno da função) */}
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
                                placeholder="O que você achou da comida e do ambiente?"
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
                                        notificationRest.notify("Por favor, digite uma nota válida entre 0 e 10.", "warning")
                                        return;
                                    }
                                    if (!avaliar || !avaliar.id) {
                                        alert("Erro: Não foi possível identificar o ID do restaurante.");
                                        return;
                                    }
                                    avaliacao.avaliarRestaurante(avaliar.id, notaEmNumero, comentarioDigitado)
                                    console.log("Enviando avaliação para o restaurante ID:", avaliar?.id);
                                    notificationRest.notify("Avaliação feita com sucesso!", "success");
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
            )}
        </>
    );
}

    
    return(
        <Template>
            <div className="w-full text-center mt-4">
                <div className="mt-6 py-3">
                    <h2 className="font-bold ">Restaurantes</h2>
                </div>

                <div className="gap-3 mt-4 py-4 p-6 rounded-xl">
                
                    <section className="flex justify-center items-center gap-2 mt-2 py-4">
                        <InputText placeholder="Digite o nome do Restaurante" onChange={event => setNome(event.target.value)}/>

                       
                        <Button type='button'
                                label='Pesquisar'
                                style='bg-blue-500 hover:bg-blue-300'/>

                    </section>
                  
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
                    {renderizarRestaurantes()}
                    </div>

                    
                </div>
                

            </div>    
     
        </Template>
    )
}
