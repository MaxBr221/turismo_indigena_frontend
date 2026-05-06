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
            <div className="min-h-screen w-full text-center">
                <div>
                    <h2>Restaurantes</h2>
                </div>

                <div>
                    <InputText placeholder="Digite o nome do Restaurante" onChange={event => setQuery(event.target.value)}/>
                </div>

            
                <div>
                    <InputText placeholder="Escolha o Local" onChange={event => setLocal(event.target.value)}/>

                    <select className="border px-4 py-2 rounded-lg text-gray-900 ">
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
     
        </Template>
    )
}
