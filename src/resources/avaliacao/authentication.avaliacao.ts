import { string } from "yup"
import { Avaliacao } from "./avaliacao.resource"
import { userAuth } from "../user/authenticatio.user";
import { notification } from "@/componente/notification";

class AuthenticationAvaliacao{
    baseString: string = "https://turismo-indigena.onrender.com/avaliacao";
    notification: any;
    
    constructor(notificationService: any) {
        this.notification = notificationService; 
    }

    async avaliarRestaurante(idRestaurante: number, nota: number, comentario?: string){
        const auth = userAuth();
        try{
            const sessao = auth.getUserSession(); 
        
            const tokenStr = sessao ? sessao.token : null;
            if(!tokenStr){
                throw new Error("Essa Usuário não está autenticado no sistema!");
            }
            console.log("Token da User/Avaliacao", tokenStr)
            const response = await fetch(this.baseString + "/avaliarRestaurante", {
                method: 'POST',
                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "authorization": `Bearer ${tokenStr}`
    
                },
                body: JSON.stringify({
                notaEmNumero: Math.round(nota),
                comentarioDigitado: comentario, 
                id: idRestaurante,              
                idPonto: null                  
        })
            });
    
            if(!response.ok){
                this.notification.notify("Não é permitido avaliar um restaurante mais de uma vez!","error");
                throw new Error("Erro ao avaliar Restaurante!");
            }
            this.notification.notify("Avaliação feita com sucesso!", "success");
            return true;
        }catch(error){
            console.error("Erro na avaliação", error);
            throw error;
        }

    }

    async avaliarPontoTuristico(idPonto:number ,nota: number, comentario?: string){
        const auth = userAuth();

        try{    
            const sessao = auth.getUserSession(); 
            const tokenStr = sessao ? sessao.token : null;

            const response = await fetch(this.baseString + "/avaliarPontoTuristico", {
                method: 'POST',
                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "authorization": `Bearer ${tokenStr}`
    
                    },
                    body: JSON.stringify({
                    notaEmNumero: Math.round(nota),
                    comentarioDigitado: comentario, 
                    idRestaurante: null,              
                    id: idPonto                  
        })

            });
    
            if(!response.ok){
                this.notification.notify("Não é permitido avaliar um Ponto Turistico mais de uma vez!","error");
                throw new Error("Erro ao avaliar Ponto Turistico!");
            }
            this.notification.notify("Avaliação feita com sucesso!", "success");
            return true;
        }catch(error){
            console.error("Erro na avaliação", error);
            throw error;
        }

    }
}
export const authAvaliacao = (notificationService: any) => new AuthenticationAvaliacao(notificationService);