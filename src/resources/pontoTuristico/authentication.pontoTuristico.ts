import { PontoTuristico } from "./pontoTuristico";

class AuthenticationPonto{
    baseUrl: string = 'http://localhost:8081/pontoTuristico/pontos';

    async buscar (): Promise<PontoTuristico[]>{
        try{
            const response = await fetch(this.baseUrl,{
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
    async buscarPorNome(nome: string){
        try{
            const response = await fetch(`http://localhost:8081/pontoTuristico/busca?nome=${encodeURIComponent(nome)}`,{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"

                }
            });
            if(!response.ok){
                console.log("Erro na busca dinamica de ponto");
            }
            return await response.json();
        }catch(error){
            console.error("erro na busca dinamica de ponto turistico: ", error);
            throw error
        }
    }

}
export const pontoTuristico = () => new AuthenticationPonto();