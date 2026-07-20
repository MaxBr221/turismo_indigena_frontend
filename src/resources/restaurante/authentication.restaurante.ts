import { Restaurante } from "./restaurante.resource";

class AuthRestaurante{
    baseUrl: string = "https://turismo-indigena.onrender.com/restaurantes/restaurantePaginacao";
    //baseUrl: string = "http://localhost:8081/restaurantes/restaurantePaginacao";

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
    // Dentro da classe AuthRestaurante no seu arquivo de service:
    async buscarMelhorAvaliado(): Promise<Restaurante | null> {
        try {
            const response = await fetch('http://localhost:8081/restaurantes/melhorAvaliado', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                // Se o Java lançar a Exception (404 ou 500) porque nenhum restaurante foi avaliado ainda
                return null; 
            }

            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar melhor avaliado no service:", error);
            return null;
        }
    }

}
export const restaurantes = () => new AuthRestaurante();