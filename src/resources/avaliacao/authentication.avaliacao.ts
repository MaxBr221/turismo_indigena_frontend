import { string } from "yup"
import { Avaliacao } from "./avaliacao.resource"

class AuthenticationAvaliacao{
    baseString: string = "http://localhost:8081/avaliacao"


    async avaliarRestaurante(idRestaurante: number, nota: number, comentario?: string){
        try{

            const response = await fetch(this.baseString + "/avaliarRestaurante", {
                method: 'POST',
                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
    
                },
                body: JSON.stringify({
                notaEmNumero: Math.round(nota), // 🎯 Se o Java pede Integer, force um inteiro com Math.round()!
                comentarioDigitado: comentario, // 🎯 Bate com @JsonProperty("comentarioDigitado")
                id: idRestaurante,              // 🎯 Bate com @JsonProperty("id")
                idPonto: null                   // 🎯 Adicione o campo que falta (ou o valor correto dele)
        })
            });
    
            if(!response.ok){
                throw new Error("Erro ao avaliar Restaurante!");
            }
            return await response.json();
        }catch(error){
            console.error("Erro na avaliação", error);
            throw error;
        }

    }

    async avaliarPontoTuristico(id:number ,nota?: number, comentario?: string){
        try{

            const response = await fetch(this.baseString + "/avaliarPontoTuristico", {
                method: 'POST',
                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
    
                    }
            });
    
            if(!response.ok){
                throw new Error("Erro ao avaliar Ponto Turistico!");
            }
            return await response.json();
        }catch(error){
            console.error("Erro na avaliação", error);
            throw error;
        }

    }
}
export const authAvaliacao = () => new AuthenticationAvaliacao;