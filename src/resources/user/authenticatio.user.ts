import { TokenAcesso, Usuario, Credencial, UsuarioSessaoToken } from "@/resources/user/user.resources"
import { string } from "yup";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; 



class UserAuth{
    baseString: string = "http://localhost:8081/auth";
    static AUTH_PARAM: string = "_auth";

     async userAuthentication(credencial: Credencial): Promise<TokenAcesso>{
       
        const response = await fetch(this.baseString + "/login", {
    
            method: 'POST',
            body: JSON.stringify(credencial),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        
        });
    

        if (!response.ok) {
            const dadosErro = await response.json();
            throw new Error(dadosErro.message || "Usuário ou senha incorretos!");
        }

        const dadosUser = await response.json();

        if (!dadosUser || !dadosUser.token) {
            throw new Error(dadosUser.message || "Credenciais inválidas ou token ausente.");
        }

        return dadosUser as TokenAcesso;
    }
    
    async save(user: Usuario): Promise<void>{

        const response = await fetch(this.baseString + "/register",{
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        

        });
        if(response.status != 201){
            const responseErro = await response.json();
            throw new Error(responseErro.error);
        }
    }
    initSession(token: TokenAcesso){
        console.log("TOKEN RECEBIDO:", token);
        if(token.token){
            const decodeToken: any = jwtDecode (token.token);
            console.log("TOKEN DECODADO:", decodeToken);

            const userSessionToken: UsuarioSessaoToken = {
                nome: decodeToken.name,
                login: decodeToken.sub,
                token: token.token,
                expiracao: decodeToken.exp
            }
            console.log("SESSÃO SALVA:", userSessionToken);
            this.setUserSession(userSessionToken);
        }
    } 
    setUserSession(userSessionToken: UsuarioSessaoToken){
        try{
            localStorage.setItem(UserAuth.AUTH_PARAM, JSON.stringify(userSessionToken));
            Cookies.set("token", userSessionToken.token!, { expires: 1, path: '/' });
        }catch(error){}

    }
    getUserSession(): UsuarioSessaoToken | null {
    // 🔍 CORREÇÃO: Verifica se estamos no ambiente do navegador (Client-side)
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const sessaoUser = localStorage.getItem(UserAuth.AUTH_PARAM);
        if (!sessaoUser) {
            console.log("token do getSessioNull: ", sessaoUser);
            return null;  
        }
        const token: UsuarioSessaoToken = JSON.parse(sessaoUser);
        console.log("nome no token: ", token.nome);
        return token;
    } catch (error) {
        console.error("Erro ao buscar token: ", error);
        return null;
    }
}
    getUserLogado(){
        const sessao = this.getUserSession();
        if(!sessao){
            return null;
        }
        return sessao;
    }
    logout() {
        try {
            localStorage.removeItem(UserAuth.AUTH_PARAM);
            Cookies.remove("token", { path: '/' });
            console.log("Sessão encerrada com sucesso.");
        } catch (error) {
            console.error("Erro ao efetuar logout:", error);
        }
    }
    async loginComGoogle(gogleToken: string | undefined): Promise<TokenAcesso>{
        if(!gogleToken){
            throw new Error("Token do google deu erro");
        }

        const response = await fetch(this.baseString + "/google",{
            method: 'POST',
            body: JSON.stringify({token: gogleToken}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        console.log("Conectou com o metodo");

        if(!response.ok){
            let mensagemErro = "Falha ao autenticar com a conta Google.";
            try {
                const textoResposta = await response.text();
                if (textoResposta.startsWith('{')) {
                    const objetoErro = JSON.parse(textoResposta);
                    mensagemErro = objetoErro.message || objetoErro.error || mensagemErro;
                } else if (textoResposta && textoResposta.length < 100) {
                    mensagemErro = textoResposta;
                }
            } catch (e) {
                console.error("Não foi possível ler o erro do Google:", e);
            }
            throw new Error(mensagemErro);    
        }
        const dadosUser = await response.json();

        if (!dadosUser || !dadosUser.token) {
        throw new Error("Credenciais do Google válidas, mas falha ao gerar sessão interna.");
    }
    return dadosUser as TokenAcesso;
}
}
export const userAuth = () => new UserAuth;
        