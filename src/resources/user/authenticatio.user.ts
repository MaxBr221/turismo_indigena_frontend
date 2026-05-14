import { TokenAcesso, Usuario, Credencial } from "@/resources/user/user.resources"
import { error } from "node:console";
import { stringify } from "node:querystring";
import { string } from "yup";
//import jwt from 'jwt-decode'


class UserAuth{
    baseString: string = 'http://localhost:8081/restaurantes/busca';

     async userAuthentication(credencial: Credencial): Promise<TokenAcesso>{
       
        const response = await fetch(this.baseString, {
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

}
    
        