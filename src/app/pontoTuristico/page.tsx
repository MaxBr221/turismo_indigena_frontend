'use client'
import { Button } from "@/componente/button/Button";
import { InputText } from "@/componente/input/InputText";
import { Template } from "@/componente/Template";
import { pontoTuristico } from "@/resources/pontoTuristico/authentication.pontoTuristico";
import { useState } from 'react';

export default function PontoPage(){
    const pontoService = pontoTuristico();
    const [query, setQuery] = useState<string>('');
    const [local, setLocal] = useState<string>('');
    

    async function buscarPontoTuristico() {
        const pontos = pontoService.buscar(query, local);

    }



    return(
        <Template>
            <div className="min-h-screen w-full text-center mt-4">

                <div className="mt-5 py-3">
                    <h1 className="font-bold ">Pontos Turisticos</h1>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4 py-4 bg-gray-900/50 p-6 rounded-xl">
                    <div className="mt-2 py-4 mr-6">
                            <InputText placeholder="Digite o Ponto Turistico" onChange={event => setQuery(event.target.value)}/>
                        </div>
                        <div className="mt-5">
                            <InputText placeholder="Escolha o Local" onChange={event => setLocal(event.target.value)}/>

                                <select className="border px-4 py-2 rounded-lg text-gray-900">
                                    <option>PRAIA</option>
                                    <option>RIO</option>
                                    <option>CENTRO</option>
                                    <option>ALDEIA</option>
                                </select>
                            <Button type="submit" 
                                    style="bg-blue-500 hover:bg-blue-300"
                                    label="Pesquisar"
                                    onClick={buscarPontoTuristico} />

                        </div>

                    </div>
                
            </div>

        </Template>
    )
}