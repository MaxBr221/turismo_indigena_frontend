'use client'
import { Template } from '@/componente/Template'
import { Button } from '@/componente/button/Button'
import { InputText } from "@/componente/input/InputText";
import { useEffect, useState } from 'react';
import { restaurantes } from '@/resources/restaurante/authentication.restaurante';
import { Restaurante } from '@/resources/restaurante/restaurante.resource';
import { userAuth } from '@/resources/user/authenticatio.user';
import { useRouter } from "next/navigation";
import { notification } from "@/componente/notification";
import { authAvaliacao } from '@/resources/avaliacao/authentication.avaliacao';

export default function RestaurantePage(){
    const notificationRest = notification();
    const restauranteService = restaurantes();
    const avaliacaoService = authAvaliacao(notificationRest);
    const router = useRouter();
    const auth = userAuth();
    const [avaliar, setAvaliar] = useState<Restaurante |  null >(null);
    const [nome, setNome] = useState< string >('');
    const [restaurante, setRestaurante] = useState< any []>([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState< boolean >(true);
    const [notaDigitada, setNotaDigitada] = useState< string >('');
    const [comentarioDigitado, setComentarioDigitado] = useState< string >('');
    const [categoriaAtiva, setCategoriaAtiva] = useState< string >("Todos");
    const categorias = ["Todos", "Cozinha Indígena", "À Beira-Mar", "Café da Aldeia", "Frutos do Mar"];
    const [melhorRestaurante, setMelhorRestaurante] = useState<Restaurante |  null >(null);

    useEffect(() => {
        const sessaoAtiva = auth.getUserSession();
        if(!sessaoAtiva){
            router.push("/login");
            return;
        }
        setCarregandoSeguranca(false);
        async function obterDestaque() {
            const topRestaurante = await restauranteService.buscarMelhorAvaliado();
            setMelhorRestaurante(topRestaurante);
        }
        obterDestaque();
    }, []);

    useEffect(() => {
        if (carregandoSeguranca) return;
        async function buscarRestaurante(){
            try{
                let getRestaurantes;
                if (nome && nome.trim() !== "") {
                    getRestaurantes = await restauranteService.buscarUnidade(nome);
                } else {
                    getRestaurantes = await restauranteService.busca();
                }
                const lista =  Array .isArray(getRestaurantes)
                ? getRestaurantes
                : (getRestaurantes?.content || []);
                setRestaurante(lista);
            } catch(error){
                console.error("Erro ao buscarRestaurantes: ", error);
            }
        }
        const delayDebounce = setTimeout(() => {
            buscarRestaurante();
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [nome, carregandoSeguranca]);

    if(carregandoSeguranca){
        return(
            <div  className ="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#1A5F7A] font-semibold">
                Verificando credenciais de acesso...
            </div>
        )
    }

    const restaurantesFiltrados = categoriaAtiva === "Todos"
    ? restaurante
    : restaurante.filter( rest  =>  rest .descricao === categoriaAtiva);

    function renderizarCards( listaParaRenderizar :  any []) {
        if ( listaParaRenderizar .length === 0) {
            return <p  className ="text-gray-500 text-center col-span-full py-4">Nenhum restaurante disponível nesta categoria.</p>;
        }

        return  listaParaRenderizar .map(( rest : Restaurante,  index :  number ) => {
            const linkMapaCoords = ( rest .latitude &&  rest .longitude)
            ? `http://maps.google.com/?q=${ rest .latitude},${ rest .longitude}`
            : null;
            const numeroLimpo =  rest .telefone ?  rest .telefone.replace(/\D/g, '') : '';
            const linkWhats = `https://wa.me/${numeroLimpo}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20restaurante%20${encodeURIComponent( rest .nome || '')}`;

            return (
                <div  key ={ rest .id ||  index }  className ="bg-white w-full border border-[#EADCC9] rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-[#C05C32] transition-all duration-200 group">
                    <div>
                        <div  className ="h-32 w-full bg-[#E3F2FD] rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4 relative">
                            🌴
                            <span  className ="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#1A5F7A] font-bold text-xs px-2 py-0.5 rounded-md shadow-sm">
                                ★ { rest .media || 'Novo'}
                            </span>
                        </div>
                        <h3  className ="text-lg font-bold text-[#1A5F7A] text-left line-clamp-1 group-hover:text-[#C05C32] transition-colors">{ rest .nome || 'Nome do Restaurante'}</h3>
                        <p  className ="text-sm text-gray-600 text-left mt-1 line-clamp-2">📍 { rest .descricao || 'Descrição não informada'}</p>
                    </div>

                    <div  className ="mt-3 flex items-center justify-between">
                        <span  className ="text-xs bg-[#C05C32]/10 text-[#C05C32] font-semibold px-2.5 py-1 rounded-full">
                            { rest .localizacao || 'Geral'}
                        </span>
                    </div>

                    <div  className ="mt-4 flex gap-1.5 pt-2 border-t border-gray-100">
                        {linkMapaCoords && (
                            <a  href ={linkMapaCoords}  target ="_blank"  rel ="noopener noreferrer"  className ="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-1.5 px-1 rounded-lg text-xs transition-colors border border-gray-200 flex items-center justify-center"  title ="Ver no Mapa">
                                🗺️ Mapa
                            </a>
                        )}
                        { rest .telefone && (
                            <a  href ={linkWhats}  target ="_blank"  rel ="noopener noreferrer"  className ="flex-1 text-center bg-green-600 hover:bg-green-500 text-white font-medium py-1.5 px-1 rounded-lg text-xs transition-colors flex items-center justify-center gap-0.5"  title ="WhatsApp">
                                💬 Whats
                            </a>
                        )}
                        <button
                            onClick ={() => {
                                console.log("📌 Restaurante clicado:",  rest );
                                setAvaliar( rest );
                            }}
                            className ="flex-1 text-center bg-[#C05C32] hover:bg-[#A84A24] text-white font-medium py-1.5 px-1 rounded-lg text-xs transition-colors flex items-center justify-center gap-0.5 cursor-pointer"
                        >
                            ⭐ Nota
                        </button>
                    </div>
                </div>
            );
        });
    }

    return (
        < Template >
        <div  className ="max-w-6xl mx-auto p-4 space-y-8 relative text-gray-800 bg-[#FDFBF7] min-h-screen pb-12">
            {/* Título Principal */}
            <div  className ="text-left mt-4 border-b border-[#EADCC9] pb-4">
                <h1  className ="text-3xl font-black text-[#1A5F7A]">🍽️ Guia de Gastronomia</h1>
                <p  className ="text-gray-500 text-sm mt-1">Busque, filtre e avalie as melhores culinárias da região.</p>
            </div>

            {/* BARRA DE PESQUISA DIGITADA */}
            <section  className ="flex justify-center items-center gap-2 max-w-xl mx-auto bg-white p-4 rounded-2xl border border-[#EADCC9] shadow-sm">
                < InputText   placeholder ="Buscar Restaurante..."  onChange ={ event  => setNome(event.target.value)}  className ="border-[#EADCC9] focus:border-[#57C5B6]" />
                < Button   type ='button'  label ='Pesquisar'  style ='bg-[#1A5F7A] hover:bg-[#124559] text-white font-semibold h-10 px-6 rounded-xl cursor-pointer'/>
            </section>

            {/* FILTROS POR BOTÕES RAPIDOS */}
            <div  className ="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categorias.map(( cat ) => (
                    <button
                        key ={cat}
                        onClick ={() => setCategoriaAtiva(cat)}
                        className ={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                            categoriaAtiva === cat
                            ? "bg-[#C05C32] text-white border-[#C05C32] shadow-md transform scale-105"
                            : "bg-white text-gray-600 border-[#EADCC9] hover:bg-gray-50"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* SEÇÃO DE DESTAQUE DINÂMICA */}
         {categoriaAtiva === "Todos" && !nome && melhorRestaurante && (
            <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#C05C32] flex items-center gap-1.5">
                    👑 Destaque da Região
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-2xl text-left">
                    <div className="bg-gradient-to-br from-[#A04020] via-[#C05C32] to-[#D4A373] text-white rounded-3xl p-6 flex flex-col justify-between h-44 shadow-xl relative overflow-hidden group border border-[#803015]/20">
                        
                        <div>
                            <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider">
                                ⭐ Média: {melhorRestaurante.media?.toFixed(2) || '0.00'} | Campeão de Avaliações
                            </span>
                            <h3 className="text-xl font-black mt-1 text-left uppercase">
                                {melhorRestaurante.nome}
                            </h3>
                            <p className="text-orange-50/90 text-xs text-left line-clamp-1 mt-0.5">
                                {melhorRestaurante.descricao || 'Sem descrição informada.'}
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <span className="text-[11px] text-orange-100 font-bold tracking-wide">
                                📍 {melhorRestaurante.localizacao || 'Centro'}
                            </span>
                            
                            <div className="flex gap-2">
                            

                                <div className="flex gap-2">
                                    <a
                                        href={
                                            melhorRestaurante.latitude && melhorRestaurante.longitude
                                                ? `http://maps.google.com/?q=${melhorRestaurante.latitude},${melhorRestaurante.longitude}`
                                                : `http://maps.google.com/?q=${encodeURIComponent(melhorRestaurante.nome + ' ' + (melhorRestaurante.localizacao || ''))}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                        title="Ver no Mapa"
                                    >
                                        🗺️ Mapa
                                    </a>

                                    <button
                                        onClick={() => {
                                            const dadosParaAvaliar = {
                                                ...melhorRestaurante,
                                                id: melhorRestaurante.id
                                            };
                                            console.log("📝 Enviando restaurante do destaque para o modal:", dadosParaAvaliar);
                                            setAvaliar(dadosParaAvaliar);
                                        }}
                                        className="bg-white text-[#C05C32] px-4 py-1.5 rounded-xl font-black text-xs hover:bg-orange-50 transition-all shadow-sm cursor-pointer active:scale-95"
                                    >
                                        Avaliar Agora
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )}

            {/* GRID GERAL DE TODOS OS RESTAURANTES */}
            <div  className ="space-y-4">
                <h2  className ="text-lg font-bold text-gray-700">
                    {categoriaAtiva === "Todos" ? "Todos os Restaurantes" : `Resultados para ${categoriaAtiva}`}
                </h2>
                <div  className ="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {renderizarCards(restaurantesFiltrados)}
                </div>
            </div>
        </div>

        {/* MODAL MODULAR DE AVALIAÇÃO */}
        {avaliar && (
            <div  className ="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div  className ="bg-white border border-[#EADCC9] p-6 rounded-xl w-80 text-gray-800 shadow-2xl">
                    <h3  className ="text-lg font-bold text-[#1A5F7A]">Avaliar {avaliar?.nome}</h3>
                    <p  className ="text-xs text-gray-500 mt-1">Dê sua nota de 0 a 10 e deixe um comentário.</p>

                    <div  className ="mt-4">
                        <label  className ="text-xs text-gray-500 block mb-1">Nota:</label>
                        <input
                            type ="number"  min ="0"  max ="10"  step ="0.1"  placeholder ="Ex: 9.5"  value ={notaDigitada}
                            onChange ={( event  => setNotaDigitada(event.target.value))}
                            className ="w-full bg-gray-50 border border-[#EADCC9] rounded p-1.5 text-gray-800 outline-none focus:border-[#57C5B6] text-sm"
                        />
                    </div>

                    <div  className ="mt-3">
                        <label  className ="text-xs text-gray-500 block mb-1">Comentário:</label>
                        <textarea
                            placeholder ="O que você achou da comida e do ambiente?"
                            className ="w-full bg-gray-50 border border-[#EADCC9] rounded p-1.5 text-gray-800 h-20 resize-none text-sm outline-none focus:border-[#57C5B6]"
                            value ={comentarioDigitado}
                            onChange ={( event ) => setComentarioDigitado(event.target.value)}
                        />
                    </div>

                    <div  className ="mt-5 flex gap-2 justify-end text-xs">
                        <button
                            onClick ={() => {
                                setAvaliar(null);
                                setNotaDigitada('');
                                setComentarioDigitado('');
                            }}
                            className ="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick ={() => {
                                const notaEmNumero = parseFloat(notaDigitada);
                                if (isNaN(notaEmNumero) || notaEmNumero < 0 || notaEmNumero > 10) {
                                    notificationRest.notify("Por favor, digite uma nota válida entre 0 e 10.", "warning")
                                    return;
                                }
                                if (!avaliar || !avaliar.id) {
                                    alert("Erro: Não foi possível identificar o ID do restaurante.");
                                    return;
                                }
                                avaliacaoService.avaliarRestaurante(avaliar.id, notaEmNumero, comentarioDigitado)
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
        </ Template >
    )
}