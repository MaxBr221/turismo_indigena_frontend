'use client'
import {Template} from '@/componente/Template'
import { Button } from '@/componente/button/Button'
import { InputText } from "@/componente/input/InputText";
import { useState } from 'react';
import { restaurantes } from '@/resources/restaurante/authentication.restaurante';




export default function RestaurantePage(){
    const restauranteService = restaurantes();
    const [query, setQuery] = useState<string>('');
    const [local, setLocal] = useState<string>('');

    async function buscarRestaurante(){
       const restaurantes = restauranteService.busca(query, local)
    }
    
    return(
        <Template>
            <div className="min-h-screen w-full text-center mt-4">
                <div className="mt-6 py-3">
                    <h2 className="font-bold">Restaurantes</h2>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4 py-4 bg-gray-900/50 p-6 rounded-xl">
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
                        <Button type='submit'
                                label='search'
                                onClick={buscarRestaurante}
                                style='bg-blue-500 hover:bg-blue-300'/>
                    </div>

                    
                </div>
                

            </div>    
     
        </Template>
    )
}
