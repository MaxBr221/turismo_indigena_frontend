import { Restaurante } from "./restaurante.resource";

class AuthRestaurante{
    baseUrl: string = 'http://localhost:8081/restaurantes';

    async busca(query: string = "", local: string = ""): Promise<Restaurante[]> {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Accept": "application/json"

            }
        });

        if(!response.ok){
            throw new Error("Erro ao buscar restaurantes")
            
        }
        return response.json();
        
    }


}
export const restaurantes = () => new AuthRestaurante();