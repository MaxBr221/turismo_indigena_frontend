import { PontoTuristico } from "./pontoTuristico";

class AuthenticationPonto{
    baseUrl: string = 'http://localhost:8081/pontoTuristico/busca';

    async buscar (query: string, local: string): Promise<PontoTuristico[]>{
        try{
            const url = `${this.baseUrl}?query=${query}&local=${local}`
            const response = await fetch(url,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"

                }
            });
            if(!response.ok){
                console.log("Erro na busca de ponto");
            }
            return await response.json();
        
        }catch(error){
            console.error("erro na conexão com ponto turistico: ", error);
            throw error
        }
    }

}
export const pontoTuristico = () => new AuthenticationPonto();