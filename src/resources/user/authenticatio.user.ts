import { TokenAcesso, Usuario, Credencial, UsuarioSessaoToken } from "@/resources/user/user.resources"
import { use } from "react";
import { string } from "yup";
import { jwtDecode } from "jwt-decode";



class UserAuth{
    baseString: string = "http://localhost:8081/auth";
    static AUTH_PARAM: string = "auth";

     async userAuthentication(credencial: Credencial): Promise<TokenAcesso>{
       
        const response = await fetch(this.baseString + "/login", {
    
            method: 'POST',
            body: JSON.stringify(credencial),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        
        });
        if(response.status == 401){
            console.error("Senha incorreta.");
        }
        return await response.json();
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
        console.log("chegando na função de registro");
        if(response.status == 409){
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
                console.log("token do getSessio: ", sessaoUser);
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
        