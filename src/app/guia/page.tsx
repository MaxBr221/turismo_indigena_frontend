'use client'
import { InputText } from "@/componente/input/InputText";
import { Template } from "@/componente/Template";
import { authGuia } from "@/resources/guia/authentication.guia";
import { Guia } from "@/resources/guia/guia.resources";
import { useEffect, useState } from "react";
import { Button } from "@/componente/button/Button";
import { userAuth } from "@/resources/user/authenticatio.user";
import { useRouter } from "next/navigation";
import { notification } from "@/componente/notification";

export default function guiaPage(){
    const [nome, setNome] = useState< string >("");
    const [guia, setGuia] = useState< any >([]);
    const [carregandoSeguranca, setCarregandoSeguranca] = useState< boolean >(true);
    const notificationGuia = notification();
    const auth = authGuia();
    const authUser = userAuth();
    const router = useRouter();

    useEffect(() => {
        const sessaoAtiva = authUser.getUserSession();
        if (!sessaoAtiva) {
            console.log("Acesso negado no componente! Redirecionando para o login...");
            router.push("/login");
            return;
        }
        setCarregandoSeguranca(false);

        async function buscarGuia(){
            try{
                let getGuide;
                if(!nome || nome.trim() != null){
                    getGuide = await auth.buscarPorGuia(nome);
                }else{
                    getGuide = await auth.buscarGuia();
                }
                console.log("guias:", getGuide);
                const listaGuia = ((getGuide as  any ).content || []);
                setGuia(listaGuia);
                if(listaGuia.length === 0){
                    notificationGuia.notify("Nenhum guia encontrado!", "info");
                }
            }catch(error){
                console.error(error);
            }
        }buscarGuia();
    },[nome])

    if(carregandoSeguranca){
        return(
            <p  className ="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#1A5F7A] font-semibold">
                Nenhum Guia no momento
            </p>
        )
    }

    function renderizarTelaGuia(){
        if(guia.length === 0){
            return(
                <div  className ="col-span-3 text-gray-500 py-8 text-center w-full">
                    Nenhum Guia Encontrado!
                </div>
            );
        };
        return guia?.map(( guias : Guia,  index :  number ) => {
            const numeroLimpo =  guias .telefone ?  guias .telefone.replace(/\D/g, '') : '';
            const linkWhats = `https://wa.me/${numeroLimpo}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20restaurante%20${encodeURIComponent( guias .nome || '')}`;
            return(
                <div  key ={ guias .id ||  index }  className ="bg-white w-60 border border-[#EADCC9] rounded-xl p-2 shadow-md flex flex-col justify-between hover:border-[#C05C32] transition-all duration-200">
                    <div>
                        <div  className ="h-32 w-full bg-[#E3F2FD] rounded-lg flex items-center justify-center text-gray-500 text-3xl mb-4">
                            🛶
                        </div>
                        <h3  className ="text-xl font-bold text-[#1A5F7A] text-left">{ guias .nome || 'Nome do Ponto Turistico'}</h3>
                        <p  className ="text-sm text-gray-600 text-left mt-1">📍 { guias .descricao || 'Descrição não informada'}</p>
                    </div>
                    <div  className ="mt-4 flex gap-2">
                        { guias .telefone && (
                            <a
                                href ={linkWhats}
                                target ="_blank"
                                rel ="noopener noreferrer"
                                className ="flex-1 text-center bg-green-600 hover:bg-green-500 text-white font-medium py-1.5 px-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                                title ="Chamar no WhatsApp"
                            >
                                <span>💬</span> WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            )
        })
    };

    return (
        < Template >
        <div  className ="w-full text-center mt-4 text-gray-800 bg-[#FDFBF7] min-h-screen">
            <div  className ="mt-5 py-3">
                <h2  className ="font-bold text-2xl text-[#C05C32]">Guias Turísticos</h2>
            </div>

            <div  className ="gap-3 mt-4 py-4 p-6 rounded-xl">
                <section  className ="flex justify-center items-center gap-2 mt-2 py-4">
                    < InputText   placeholder ="Pesquise o Guia desejado!"  onChange ={ event  => setNome( event .target.value)}  className ="border-[#EADCC9] focus:border-[#57C5B6]" />
                    < Button   type ="submit"
                        style ="bg-[#1A5F7A] hover:bg-[#124559] text-white font-semibold"
                        label ="Pesquisar"/>
                </section>

                <div  className ="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center">
                    {renderizarTelaGuia()}
                </div>
            </div>
        </div>
        </ Template >
    )
}