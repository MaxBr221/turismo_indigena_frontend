'use client'
import { Button } from "@/componente/button/Button";
import { InputText } from "@/componente/input/InputText";
import { Template } from "@/componente/Template";
import { pontoTuristico } from "@/resources/pontoTuristico/authentication.pontoTuristico";
import { PontoTuristico } from "@/resources/pontoTuristico/pontoTuristico";
import { useEffect, useState } from 'react';

export default function PontoPage(){
    const pontoService = pontoTuristico();
    const [query, setQuery] = useState<string>('');
    const [local, setLocal] = useState<string>('');
    const [listaPonto, setListaPonto] = useState<any[]>([]);
    
    useEffect(() => {
         async function buscarPontoTuristico() {
            try{
                const pontos = await pontoService.buscar(query, local);
                console.log(pontos, "Pontos");
                setListaPonto((pontos as any).content || []);

            }catch(error){
                console.log(error)
            }
        }buscarPontoTuristico();

    }, [query, local])


    function renderizarTelaPonto(){
        if(listaPonto.length === 0){
            return(
                <div className="col-span-3 text-gray-400 py-8 text-center w-full">
                    Nenhum Ponto Turistico Encontrado!
                </div>
            );
        };
        return listaPonto?.map((pontos: PontoTuristico, index: number) => {
            return(
                <div key={pontos.id || index} className="bg-gray-800 w-60 border border-gray-700 rounded-xl p-2 shadow-lg flex flex-col justify-between hover:border-green-500 transition-all duration-200"
                    >
            
                    <div>
                        <div className="h-32 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                            🍕
                        </div>
                        <h3 className="text-xl font-bold text-white text-left">{pontos.nome || 'Nome do Ponto Turistico'}</h3>
                        <p className="text-sm text-gray-400 text-left mt-1">📍 {pontos.informacoes || 'Descrição não informada'}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full">
                            {pontos.local || 'Local'}
                        </span>
            
                    </div>
                </div>    
            )
        })
    }
    
    return(
        <Template>
            <div className="w-full text-center mt-4">

                <div className="mt-5 py-3">
                    <h2 className="font-bold ">Pontos Turisticos</h2>
                </div>

                <div className="gap-3 mt-4 py-4 p-6 rounded-xl">
                    <section className="flex justify-center items-center gap-2 mt-2 py-4">
                        <InputText placeholder="Digite o Ponto Turistico" onChange={event => setQuery(event.target.value)}/>

                        <select className="border px-4 py-2 rounded-lg text-gray-900"
                            value={local} onChange={event => setLocal(event.target.value)}>
                            <option>PRAIA</option>
                            <option>RIO</option>
                            <option>CENTRO</option>
                            <option>ALDEIA</option>
                        </select>
                        <Button type="submit" 
                            style="bg-blue-500 hover:bg-blue-300"
                            label="Pesquisar"/>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">   
                    {renderizarTelaPonto()}
                    </div>

                </div>
                
            </div>

        </Template>
    )
}