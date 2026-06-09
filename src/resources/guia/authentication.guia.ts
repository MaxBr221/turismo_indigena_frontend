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
}
export const authGuia = () => new AuthenticationGuia();