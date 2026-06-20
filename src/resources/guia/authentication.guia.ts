import { Guia } from "./guia.resources";

class AuthenticationGuia{
    baseString: string = "http://localhost:8081/guide";
    

    async buscarGuia(): Promise<Guia>{
        try{
            const response = await fetch(this.baseString ,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"

                }
            });

            if(!response.ok){
                throw new Error("Erro");
                
            }
            return await response.json();

        }catch(error){
            throw new Error("Erro na autenticação");
        }
        
    }
    async buscarPorGuia(nome: string){
        try{
            const response = await fetch(`http://localhost:8081/guide/busca?nome=${encodeURIComponent(nome)}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"

                }
            });
            if(!response.ok){
                console.error("Erro na busca dinamica");
            }
            return await response.json();
        }catch(error){
            console.error("Erro no sistema devido a busca dinamica", error);
            throw error;
        }
    }
}
export const authGuia = () => new AuthenticationGuia();