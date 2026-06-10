'use client'
import React from 'react';
import { Button } from "./button/Button"
import { usePathname, useRouter } from 'next/navigation'; 


export const Header: React.FC = () =>{
    const pathname = usePathname();     
    const router = useRouter();

    const rotasComBotao = ['/restaurante', '/pontoTuristico', '/guia'];
    const mostrarBotao = rotasComBotao.includes(pathname);
    const mostrarBotaoSair = pathname === '/painel';
  
    
    return(

        <header className="bg-blue-900 text-white px-3 py-3 ">
            <div className="container mx-auto flex justify-between text-center px-2 font-bold">
                <h1>Sistema de Turismo</h1>
            </div>
            <div className='flex justify-end '>
                {mostrarBotao && (
                    <Button 
                    type='button'
                    label='Voltar para Painel'
                    style='bg-blue-500 hover:bg-blue-300 -mt-7'
                    onClick={() => router.push('/painel')} 
                    />
                )}
                {mostrarBotaoSair && (
                    <Button type="button"
                            label="Sair"
                            style="text-white font-bold bg-red-600 hover:bg-red-700 px-4 py-2 -mt-7 rounded-md transition-colors"
                            onClick={() => router.push("/login")}
                            />
                )}

            </div>

        </header>




    )
}