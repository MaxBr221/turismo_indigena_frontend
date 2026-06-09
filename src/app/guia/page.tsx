'use client'
import { InputText } from "@/componente/input/InputText";
import { Template } from "@/componente/Template";
import { authGuia } from "@/resources/guia/authentication.guia";
import { Guia } from "@/resources/guia/guia.resources";
import { useEffect, useState } from "react";
import { Button } from "@/componente/button/Button";



export default function guiaPage(){
    const [query, setQuery] = useState<string>("");
    const [local, setLocal] = useState<string>("");
    const auth = authGuia();
    const [guia, setGuia] = useState<any[]>([]);

    useEffect(() => {
        async function buscarGuia(){
            try{
                const guias = await auth.buscarGuia();
                console.log("guias:", guias);
                setGuia((guias as any).content || []);

            }catch(error){
                throw new Error("erro ao buscar guias");
            }
        }buscarGuia();
    })

    function renderizarTelaGuia(){
        if(guia.length === 0){
            return(
                <div className="col-span-3 text-gray-400 py-8 text-center w-full">
                    Nenhum Guia Encontrado!
                </div>
            );

        };
        return guia?.map((guias: Guia, index: number) => {
            return(
                <div key={guias.id || index} className="bg-gray-800 w-60 border border-gray-700 rounded-xl p-2 shadow-lg flex flex-col justify-between hover:border-green-500 transition-all duration-200">
                     <div>
                        <div className="h-32 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                            🍕
                        </div>
                        <h3 className="text-xl font-bold text-white text-left">{guias.nome || 'Nome do Ponto Turistico'}</h3>
                        <p className="text-sm text-gray-400 text-left mt-1">📍 {guias.descricao || 'Descrição não informada'}</p>
                    </div>
                </div>
            )
        })
    };
    return (
        <Template>
            <div className="w-full text-center mt-4">
                <div className="mt-5 py-3">
                    <h2 className="font-bold">Guias Turisticos</h2>
                </div>

                <div className="gap-3 mt-4 py-4 p-6 rounded-xl">   
                    <section className="flex justify-center items-center gap-2 mt-2 py-4">
                        <InputText placeholder="Pesquise o Guia desejado!" onChange={event => setQuery(event.target.value)} />
                        <Button type="submit" 
                                style="bg-blue-500 hover:bg-blue-300"
                                label="Pesquisar"/>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">   
                    {renderizarTelaGuia()}
                    </div>
                </div>





                
            </div>
        </Template>
    )



}