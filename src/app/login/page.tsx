'use client'
import { InputText } from "@/componente/input/InputText";
import { Template } from "@/componente/Template";
import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/componente/button/Button";
import { formScheme, LoginForm } from "@/componente/login/formScheme";
import { Credencial, TokenAcesso } from "@/resources/user/user.resources";
import { userAuth } from "@/resources/user/authenticatio.user";

export default function LoginPage(){
    const auth = userAuth();
    const [newUserStates, setNewUserStates] = useState<boolean> (true);
    const {values, handleChange, handleSubmit, errors, resetForm} = useFormik<LoginForm>({
        initialValues: formScheme,
        onSubmit: onSubmit
    })

    async function onSubmit(values: LoginForm) {
        console.log(values);
        const credencial: Credencial = {login: values.login, senha: values.senha};
        try{
            const acesso: TokenAcesso = await auth.userAuthentication(credencial);
            console.log("Chegando na parte de token");
        }catch(error){
            throw
        }
        
        

        
    }
    return(
        //conectar com o token amanhã
        <Template>
            <div className="w-full text-center mt-4">
                <div className="mt-2 py-3">
                    <h2 className="font-bold text-xl">Cadastro</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form   className="space-y-2">
                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center gap-4">Nome:</label>
                        </div>
                        <div className="mt-2">
                            <InputText style="w-full"
                                        id="name"
                                        placeholder="Digite seu Nome"/>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Telefone:</label>
                        </div>

                         <div className="mt-2">
                            <InputText style="w-full"
                                        id="number"
                                        placeholder="Digite seu Número"/>
                        </div>


                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Login:</label>
                        </div>

                         <div className="mt-2">
                            <InputText style="w-full"
                                        id="login"
                                        placeholder="Digite seu Email"/>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Senha:</label>
                        </div>

                        <div className="mt-2">
                            <InputText style="w-full"
                                        id="senha"
                                        type="password"
                                        placeholder="Digite sua Senha"/>
                        </div>

                         <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Confirmar senha:</label>
                        </div>

                        <div className="mt-2">
                            <InputText style="w-full"
                                        id="confirmarSenha"
                                        type="password"
                                        placeholder="Confirme sua Senha"/>
                        </div>

                        <div>
                            <Button type="submit" style="bg-indigo-700 hover:bg-indigo-500 mt-3" label="Salvar" ></Button>
                        </div>

                        
                    </form>



                </div>

            </div>


        </Template>
    )
}