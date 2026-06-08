import { TokenAcesso, Usuario, Credencial, UsuarioSessaoToken } from "@/resources/user/user.resources"
import { use } from "react";
import { string } from "yup";
import { jwtDecode } from "jwt-decode";



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
        if(!response.ok || response.status != 202){
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
            this.setUserSession(userSessionToken)
        }
    } 
    setUserSession(userSessionToken: UsuarioSessaoToken){
        try{
            localStorage.setItem(UserAuth.AUTH_PARAM, JSON.stringify(userSessionToken));

        }catch(error){}

    }
    getUserSession() : UsuarioSessaoToken | null {
        try{
            const sessaoUser = localStorage.getItem(UserAuth.AUTH_PARAM);
            if(!sessaoUser){
                console.log("token do getSessioNull: ", sessaoUser);
                return null;

                
            }
            const token:UsuarioSessaoToken = JSON.parse(sessaoUser);
            console.log("token do getSessio: ", token);
            return token;
        }catch(error){
            console.error("Erro ao buscar token: ", error);
            return null;
        }
    }
}
   
export const userAuth = () => new UserAuth;
        