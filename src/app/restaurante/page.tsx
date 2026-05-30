'use client'
import {Template} from '@/componente/Template'
import { Button } from '@/componente/button/Button'
import { InputText } from "@/componente/input/InputText";
import { useEffect, useState } from 'react';
import { restaurantes } from '@/resources/restaurante/authentication.restaurante';
import { Formik, useFormik } from 'formik';
import { Restaurante } from '@/resources/restaurante/restaurante.resource';




export default function RestaurantePage(){
    const restauranteService = restaurantes();
    const [query, setQuery] = useState<string>('');
    const [local, setLocal] = useState<string>('');
    const [restaurante, setRestaurante] = useState<any[]>([]);

    useEffect(() => {
        async function buscarRestaurante(){
            try{
                const getRestaurantes = await restauranteService.busca(query, local)
                setRestaurante(getRestaurantes);

            }catch(error){
                console.error("Erro ao buscarRestaurantes: ", error);
            }
                
        }buscarRestaurante();

    }, [query, local]);

    
    function renderizarRestaurantes(){
        if(restaurante.length === 0){
            return(
                <div className="col-span-3 text-gray-400 py-8 text-center w-full">
                    Nenhum Restaurante Encontrado!
                </div>
            )
        }
        return restaurante.map((rest: Restaurante) =>{
            return(
                    <div key={rest.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-orange-500 transition-all duration-200"
                    >
            
                    <div>
                        <div className="h-32 w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                            🍕
                        </div>
                        <h3 className="text-xl font-bold text-white text-left">{rest.nome || 'Nome do Restaurante'}</h3>
                        <p className="text-sm text-gray-400 text-left mt-1">📍 {rest.descricao || 'Descrição não informada'}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full">
                            {rest.localizacao || 'Local'}
                        </span>
            
                    </div>
                </div>    

            )
        })

            
    }

    
    return(
        <Template>
            <div className="min-h-screen w-full text-center mt-4">
                <div className="mt-6 py-3">
                    <h2 className="font-bold">Restaurantes</h2>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4 py-4 bg-gray-900/50 p-6 rounded-xl">
                
                    <section>
                        <div className="mt-2 py-4 mr-6">
                            <InputText placeholder="Digite o nome do Restaurante" onChange={event => setQuery(event.target.value)}/>
                        </div>

                    
                        <div>
                            <InputText placeholder="Escolha o Local" onChange={event => setLocal(event.target.value)}/>

                            <select className="border px-4 py-2 rounded-lg text-gray-900">
                                <option>PRAIA</option>
                                <option>RIO</option>
                                <option>CENTRO</option>
                                <option>ALDEIA</option>
                            </select>
                            <Button type='button'
                                    label='search'
                                    style='bg-blue-500 hover:bg-blue-300'/>
                        </div>

                    </section>
                  
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {renderizarRestaurantes()}
                    </div>

                    
                </div>
                

            </div>    
     
        </Template>
    )
}
