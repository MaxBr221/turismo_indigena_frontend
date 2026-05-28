import { Restaurante } from "./restaurante.resource";

class AuthRestaurante{
    baseUrl: string = 'http://localhost:8081/restaurantes/busca';

    async busca(query: string = "", local: string = ""): Promise<Restaurante[]> {
        try{
            const url = `${this.baseUrl}?query=${query}&local=${local}`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"

                }
            });

            if(!response.ok){
                throw new Error('Erro ao buscar restaurantes: ${response.status}')
                
            }
            return await response.json();
        
    
        }catch(error){
            console.error("erro:", error);
            throw error;
            
        }
        
        
    }


}
export const restaurantes = () => new AuthRestaurante();