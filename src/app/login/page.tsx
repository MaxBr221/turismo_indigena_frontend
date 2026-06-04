'use client'
import { InputText } from "@/componente/input/InputText";
import { Template, RendeIf} from "@/componente/Template";
import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/componente/button/Button";
import { LoginForm, formScheme, validationScheme } from "@/componente/login/formScheme";
import { Credencial, TokenAcesso } from "@/resources/user/user.resources";
import { userAuth } from "@/resources/user/authenticatio.user";
import { useRouter } from 'next/navigation';

export default function LoginPage(){
    const auth = userAuth();
    const router = useRouter();
    const [newUserStates, setNewUserStates] = useState<boolean> (false);
    const {values, handleChange, handleSubmit, errors, resetForm} = useFormik<LoginForm>({
        initialValues:{
            login: '',
            senha: ''

        },

        onSubmit: onSubmit
    })

    async function onSubmit(values: LoginForm) {
        console.log(values);
        const credencial: Credencial = {login: values.login, senha: values.senha};
        try{
            const acesso: TokenAcesso = await auth.userAuthentication(credencial);
            if (!acesso || !acesso.token) {
                throw new Error("Senha incorreta ou falha na autenticação!");
            }
            auth.initSession(acesso);
            console.log(acesso)
            router.push("/painel");
            console.log("Chegando no Painel");
        }catch(error: any){
            console.error("erro no tokeeen");
            alert(error.message || "user ou senha errada");
        }
             
    }
    return(
        
        <Template>
            <div className="w-full text-center mt-4">
                <div className="mt-2 py-3">
                    <h2 className="font-bold text-xl">
                        {newUserStates ? 'Cadastro' : 'Faça Login com sua Conta'}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <RendeIf condition={newUserStates}>
                            <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center gap-4">Nome:</label>
                            </div>
                            <div className="mt-2">
                                <InputText className="w-full"
                                            id="name"
                                            name="name"
                                            placeholder="Digite seu Nome"/>
                            </div>

                        </RendeIf>
                        
                        <RendeIf condition={newUserStates}>
                            <div className="flex items-center gap-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Telefone:</label>
                            </div>

                            <div className="mt-2">
                                <InputText className="w-full"
                                            id="number"
                                            name="number"
                                            placeholder="Digite seu Número"/>
                            </div>

                        </RendeIf>
                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Login:</label>
                        </div>

                         <div className="mt-2">
                            <InputText className="w-full"
                                        id="login"
                                        name="login"
                                        value={values.login}
                                        onChange={handleChange}
                                        placeholder="Digite seu Email"/>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Senha:</label>
                        </div>

                        <div className="mt-2">
                            <InputText className="w-full"
                                        id="senha"
                                        name="senha"
                                        type="password"
                                        value={values.senha}
                                        onChange={handleChange}
                                        placeholder="Digite sua Senha"/>
                        </div>
                        <RendeIf condition={newUserStates}>
                            <div className="flex items-center gap-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Confirmar senha:</label>
                            </div>
                            <div className="mt-2">
                            <InputText className="w-full"
                                        id="confirmarSenha"
                                        name="confirmarSenha"
                                        type="password"
                                        placeholder="Confirme sua Senha"/>
                            </div>


                        </RendeIf> 

                        <div>
                            <RendeIf condition={newUserStates}>
                                <Button type="submit" 
                                        style="bg-indigo-700 hover:bg-indigo-500 mt-3" 
                                        label="Salvar"/>
                                        
                                <span 
                                    onClick={() => setNewUserStates(false)} 
                                    className="block text-sm text-indigo-600 hover:underline mt-4 cursor-pointer"
                                >
                                    Já possui conta? Faça Login
                                </span>


                            </RendeIf>    

                            <RendeIf condition={!newUserStates}>
                                <Button type="submit" 
                                        style="bg-indigo-700 hover:bg-indigo-500 mt-3" 
                                        label="Login"/>
                                    
                                <span 
                                    onClick={() => setNewUserStates(true)} 
                                    className="block text-sm text-indigo-600 hover:underline mt-4 cursor-pointer"
                                >
                                    Não tem conta? Cadastre-se aqui
                                </span>
                            </RendeIf>
                        </div>
                    </form>
                </div>
            </div>
        </Template>
    )
}