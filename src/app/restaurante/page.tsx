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
    const [avaliar, setAvaliar] = useState<Restaurante | null>(null);
    const [nome, setNome] = useState<string>('');
    const [restaurante, setRestaurante] = useState<any[]>([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState<boolean>(true); 
    const [notaDigitada, setNotaDigitada] = useState<string>('');
    const [comentarioDigitado, setComentarioDigitado] = useState<string>('');
    const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todos");
    const categorias = ["Todos", "Nordestina", "Cafeterias", "Frutos do Mar", "Econômico"];
    const [melhorRestaurante, setMelhorRestaurante] = useState<Restaurante | null>(null);

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
                
                const lista = Array.isArray(getRestaurantes) 
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
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white font-semibold">
                Verificando credenciais de acesso...
            </div>
        )
    }

  
    const restaurantesFiltrados = categoriaAtiva === "Todos"
        ? restaurante
        : restaurante.filter(rest => rest.descricao === categoriaAtiva);


    const destaques = [...restaurante]
        .filter(rest => (rest.media || 0) > 0)
        .sort((a, b) => (b.media || 0) - (a.media || 0)) 
        .slice(0, 1); 
        function renderizarCards(listaParaRenderizar: any[]) {
        if (listaParaRenderizar.length === 0) {
            return <p className="text-gray-400 text-center col-span-full py-4">Nenhum restaurante disponível nesta categoria.</p>;
        }

        return listaParaRenderizar.map((rest: Restaurante, index: number) => {
            const linkMapaCoords = (rest.latitude && rest.longitude)
                ? `http://maps.google.com/?q=${rest.latitude},${rest.longitude}`
                : null;
            
            const numeroLimpo = rest.telefone ? rest.telefone.replace(/\D/g, '') : '';
            const linkWhats = `https://wa.me/${numeroLimpo}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20restaurante%20${encodeURIComponent(rest.nome || '')}`;
            
            return (
                <div key={rest.id || index} className="bg-gray-800 w-full border border-gray-700 rounded-xl p-4 shadow-lg flex flex-col justify-between hover:border-orange-500 transition-all duration-200">
                    <div>
                        <div className="h-32 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4 relative">
                            🍕
                            <span className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm text-amber-400 font-bold text-xs px-2 py-0.5 rounded-md">
                                ★ {rest.media || 'New'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white text-left line-clamp-1">{rest.nome || 'Nome do Restaurante'}</h3>
                        <p className="text-sm text-gray-400 text-left mt-1 line-clamp-2">📍 {rest.descricao || 'Descrição não informada'}</p>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full">
                            {rest.localizacao || 'Geral'}
                        </span>
                    </div>
                    
                    <div className="mt-4 flex gap-1.5 pt-2 border-t border-gray-700">
                        {linkMapaCoords && (
                            <a href={linkMapaCoords} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-1.5 px-1 rounded-lg text-xs transition-colors flex items-center justify-center" title="Ver no Mapa">
                                🗺️ Mapa
                            </a>
                        )}

                        {rest.telefone && (
                            <a href={linkWhats} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-600 hover:bg-green-500 text-white font-medium py-1.5 px-1 rounded-lg text-xs transition-colors flex items-center justify-center gap-0.5" title="WhatsApp">
                                💬 Whats
                            </a>
                        )}

                        <button
                            onClick={() => {
                                console.log("📌 Restaurante clicado:", rest);
                                setAvaliar(rest);
                            }}
                            className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-1 rounded-lg text-xs transition-colors flex items-center justify-center gap-0.5 cursor-pointer"
                        >
                            ⭐ Nota
                        </button>
                    </div>
                </div> 
            );
        });
    }

    return (
        <Template>
            <div className="max-w-6xl mx-auto p-4 space-y-8 relative text-white">
            
                {/* Título Principal */}
                <div className="text-left mt-4 border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold text-white">🍽️ Guia de Gastronomia</h1>
                    <p className="text-gray-400 text-sm mt-1">Busque, filtre e avalie as melhores culinárias da região.</p>
                </div>

                {/* BARRA DE PESQUISA DIGITADA */}
                <section className="flex justify-center items-center gap-2 max-w-xl mx-auto bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <InputText placeholder="Digite o nome do Restaurante..." onChange={event => setNome(event.target.value)}/>
                    <Button type='button' label='Pesquisar' style='bg-orange-500 hover:bg-orange-600 text-white font-semibold h-10 px-6 rounded-xl'/>
                </section>

                {/* 🎯 NOVO COMPONENTE: FILTROS POR BOTÕES RAPIDOS */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {categorias.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoriaAtiva(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                                categoriaAtiva === cat
                                    ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
                                    : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 🎯 SEÇÃO DE DESTAQUE DINÂMICA VIA ENDPOINT JAVA */}
            {categoriaAtiva === "Todos" && !nome && melhorRestaurante && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-left text-amber-400 flex items-center gap-2">
                        🔥 O Queridinho dos Turistas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-2xl text-left">
                        <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 rounded-2xl p-5 flex flex-col justify-between h-40 shadow-xl relative overflow-hidden group border border-amber-500/30">
                            <div>
                                <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider">
                                    ⭐ Média: {melhorRestaurante.media?.toFixed(2) || '0.00'} | Campeão de Avaliações
                                </span>
                                <h3 className="text-xl font-black mt-1 text-left">
                                    {melhorRestaurante.nome}
                                </h3>
                                <p className="text-orange-100 text-xs text-left line-clamp-1 mt-0.5">
                                    {melhorRestaurante.descricao || 'Sem descrição informada.'}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] text-amber-100 font-medium">
                                    📍 {melhorRestaurante.localizacao || 'Centro'}
                                </span>
                                <button 
                                    onClick={() => {
                                        // Mapeia os dados garantindo o ID correto vindo do DTO
                                        const dadosParaAvaliar = {
                                            ...melhorRestaurante,
                                            id: melhorRestaurante.id
                                        };
                                        
                                        console.log("📝 Enviando restaurante do destaque para o modal:", dadosParaAvaliar);
                                        setAvaliar(dadosParaAvaliar);
                                    }}
                                    className="bg-white text-orange-700 px-3 py-1 rounded-xl font-bold text-xs hover:bg-orange-50 transition-colors shadow-sm cursor-pointer"
                                >
                                    Avaliar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

                {/* GRID GERAL DE TODOS OS RESTAURANTES */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-left text-orange-900">
                        📍 {categoriaAtiva === "Todos" ? "Todos os Restaurantes" : `Resultados para ${categoriaAtiva}`}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {renderizarCards(restaurantesFiltrados)}
                    </div>
                </div>

            </div>

            {/* MODAL MODULAR DE AVALIAÇÃO */}
            {avaliar && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-80 text-white shadow-2xl">
                        <h3 className="text-lg font-bold">Avaliar {avaliar?.nome}</h3>
                        <p className="text-xs text-gray-400 mt-1">Dê sua nota de 0 a 10 e deixe um comentário.</p>

                        <div className="mt-4">
                            <label className="text-xs text-gray-400 block mb-1">Nota:</label>
                            <input 
                                type="number" min="0" max="10" step="0.1" placeholder="Ex: 9.5"
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
                                onChange={(event) => setComentarioDigitado(event.target.value)} 
                            />
                        </div>

                        <div className="mt-5 flex gap-2 justify-end text-xs">
                            <button 
                                onClick={() => {
                                    setAvaliar(null);
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
                                    avaliacaoService.avaliarRestaurante(avaliar.id, notaEmNumero, comentarioDigitado)
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
        </Template>
    )
}