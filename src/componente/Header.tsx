import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export const Header: React.FC = () => {
    const pathname = usePathname();    
    const router = useRouter();
    const [menuAberto, setMenuAberto] = useState(false);

    const rotasComBotaoVoltar = ['/restaurante', '/pontoTuristico', '/guia', '/user'];
    const mostrarVoltar = rotasComBotaoVoltar.includes(pathname);
    const mostrarMenuPerfil = pathname === '/painel';

    const lidarComSair = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("_auth");
        }
        router.push("/login");
    };

    return (
        <header className="bg-[#1A5F7A] text-white shadow-lg border-b border-white/10 relative z-50">
            <div className="container mx-auto flex justify-between items-center px-6 py-4">
                
                {/* Logo / Título */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/painel')}>
                    <span className="text-2xl">🏹</span>
                    <h1 className="text-xl font-black tracking-tight uppercase">Turismo Indigena</h1>
                </div>

                {/* ⬅️ BOTÃO DE VOLTAR (Aparece nas páginas internas) */}
                {mostrarVoltar && (
                    <button
                        onClick={() => router.push('/painel')}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-black transition-all border border-white/20 flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                        ← PAINEL
                    </button>
                )}

                {/* 👤 MENU DROPDOWN DE PERFIL (Aparece apenas no Painel) */}
                {mostrarMenuPerfil && (
                    <div className="relative">
                        <button
                            onClick={() => setMenuAberto(!menuAberto)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/20 focus:outline-none cursor-pointer"
                        >
                            👤 Menu
                            <span className={`text-xs transition-transform duration-200 ${menuAberto ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {/* CAIXA SUSPENSA DO MENU */}
                        {menuAberto && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EADCC9] rounded-xl shadow-2xl py-2 text-gray-800 animate-fade-in">
                                <button
                                    onClick={() => {
                                        setMenuAberto(false);
                                        router.push("/user");
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FDFBF7] transition-colors flex items-center gap-2 text-gray-700 font-medium"
                                >
                                    🖼️ Ver Perfil
                                </button>
                                <hr className="border-[#EADCC9] my-1" />
                                <button
                                    onClick={lidarComSair}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 font-bold"
                                >
                                    🚪 Sair
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </header>
    );
};