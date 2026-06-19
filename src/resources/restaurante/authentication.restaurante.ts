import { Restaurante } from "./restaurante.resource";

class AuthRestaurante{
    baseUrl: string = 'http://localhost:8081/restaurantes/restaurantePaginacao';

    async busca(): Promise<Restaurante[]> {
        try{
            const response = await fetch(this.baseUrl, {
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
    async buscarUnidade(nome: string){
        if(!nome.trim){
            return [];
        }
        try{
            const response = await fetch(`http://localhost:8081/restaurantes/busca?nome=${encodeURIComponent(nome)}`,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"

                }
            });
            
            return await response.json()
        }catch(error){
            console.error("Erro na busca dinamica", error);
            throw error;
        }
    }


}
export const restaurantes = () => new AuthRestaurante();