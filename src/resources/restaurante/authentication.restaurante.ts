import { error } from "node:console";
import { Restaurante } from "./restaurante.resource";

class AuthRestaurante{
    baseUrl: string = 'http://localhost:8081/restaurantes';

    async busca(query: string = "", local: string = "") {
        const response = await fetch(this.baseUrl, {

            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"

            }
        });

        if(!response.ok){
            throw error("Erro ao buscar restaurantes")
        }
        return response.json();
        
    }


}
export const restaurantes = () => new AuthRestaurante();