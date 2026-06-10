import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Tenta buscar o token de autenticação
    // Nota: O Middleware do Next.js roda no servidor, então ele lê melhor os COOKIES.
    // Se você salvou o token apenas no localStorage, veja a observação abaixo!
    const token = request.cookies.get('token')?.value;

    const { pathname } = request.nextUrl;

    // 2. Se o usuário TENTAR entrar no painel/restaurantes SEM estar logado
    if (!token && (pathname.startsWith('/painel') || pathname.startsWith('/restaurante') || pathname.startsWith('/ponto-turistico'))) {
        // Redireciona ele imediatamente para a tela de login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Se o usuário JÁ ESTIVER logado e tentar ir para a página de login, manda pro painel
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/painel', request.url));
    }

    return NextResponse.next();
}

// 4. Configura quais rotas esse Middleware deve monitorar
export const config = {
    matcher: [
        '/painel/:path*',
        '/restaurante/:path*',
        '/pontoTuristico/:path*',
        '/login'
    ],
};