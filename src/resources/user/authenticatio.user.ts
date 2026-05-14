import { TokenAcesso, Usuario, Credencial, UsuarioSessaoToken } from "@/resources/user/user.resources"
import { error } from "node:console";
import { stringify } from "node:querystring";
import { use } from "react";
import { string } from "yup";
import { jwtDecode } from "jwt-decode";



class UserAuth{
    baseString: string = 'http://localhost:8081/user/busca';
    static AUTH_PARAM: string = "auth";

     async userAuthentication(credencial: Credencial): Promise<TokenAcesso>{
       
        const response = await fetch(this.baseString + "/auth", {
            method: 'POST',
            body: JSON.stringify(credencial),
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"
            }
        
        });
        if(response.status == 401){
            throw error("Senha incorreta.");
        }
        return await response.json();
    }
    
    async save(user: Usuario): Promise<void>{

        const response = await fetch(this.baseString + "/register",{
            method: "POST",
            body: JSON.stringify(user),
            headers:{
                "content-type":"application/json",
                "Accept":"application/json"
            }

        });
        if(response.status == 409){
            const responseErro = await response.json();
            throw new Error(responseErro.error);
        }
    }
    initSession(token: TokenAcesso){
        console.log("TOKEN RECEBIDO:", token);
        if(token.tokenAcesso){
            const decodeToken: any = jwtDecode (token.tokenAcesso);
            console.log("TOKEN DECODADO:", decodeToken);

            const userSessionToken: UsuarioSessaoToken = {
                nome: decodeToken.name,
                login: decodeToken.sub,
                token: token.tokenAcesso,
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
}
    
        