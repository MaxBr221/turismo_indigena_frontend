'use client'
import { InputText } from "@/componente/input/InputText";
import { Template, RendeIf} from "@/componente/Template";
import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/componente/button/Button";
import { LoginForm, formScheme, validationScheme } from "@/componente/login/formScheme";
import { Credencial, TokenAcesso, Usuario, UsuarioSessaoToken } from "@/resources/user/user.resources";
import { userAuth } from "@/resources/user/authenticatio.user";
import { useRouter } from 'next/navigation';
import { FieldError } from "@/componente/FieldError";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { notification } from "@/componente/notification";

export default function LoginPage(){
    const auth = userAuth();
    const notify = notification();
    const router = useRouter();
    const [newUserStates, setNewUserStates] = useState<boolean> (false);
    const {values, handleChange, handleSubmit, errors, resetForm} = useFormik<LoginForm>({
        initialValues:{
            login: '',
            senha: ''

        },
        validationSchema: validationScheme,
        onSubmit: onSubmit
    })

    async function onSubmit(values: LoginForm) {
        console.log(values);
        if(!newUserStates){
            const credencial: Credencial = {login: values.login, senha: values.senha};
            try{
                const acesso: UsuarioSessaoToken = await auth.userAuthentication(credencial);
                if (!acesso || !acesso.token) {
                    throw new Error("Senha incorreta ou falha na autenticação!");
                }
                auth.setUserSession(acesso);
                router.push("/painel");
                console.log("Chegando no Painel");
            }catch(error: any){
                if (error.response) {
                    const status = error.response.status;
                    
                    if (status === 401) {
                        notify.notify('Senha incorreta!', 'error');
                    } else {
                        notify.notify('Usuário não cadastrado!', 'error');
                    }
                } else {
                    notify.notify(error.message || 'Erro ao realizar login!', 'error');
                }
            }
        }else{
            const newUser: Usuario = {login: values.login, senha: values.senha, nome: values.nome, telefone: values.telefone};
            try{
                await auth.save(newUser);
                console.log("Salvando novo Usuário!", newUser.nome);
                resetForm();
                notify.notify("Usuário salvo com sucesso!", "success");
                setNewUserStates(false);
            }catch(error){
                notify.notify("Usuário já existente", "error");
                throw new Error(`Erro ao salvar usuário: ${(error as Error).message}`);
            }
        }
             
    }
    async function handleLoginGoogleSucesso(credentialResponse: any) {
        try {
            console.log("Token criptografado enviado pelo Google:", credentialResponse.credential);
            const acesso: UsuarioSessaoToken = await auth.loginComGoogle(credentialResponse.credential);
            auth.setUserSession(acesso);
            router.push("/painel");
            console.log("Logado com Google com sucesso!");
            
        } catch (error: any) {
            console.error("Erro no login com Google:", error);
            alert(error.message || "Falha ao autenticar com a conta Google.");
        }
    }
    return(     
        <Template>
            <div className="w-full text-center mt-3">
                <div className="py-3">
                    <h2 className="font-bold text-xl">
                        {newUserStates ? 'Cadastro' : 'Faça Login com sua Conta'}
                    </h2>
                </div>

                <div className="mt- sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <RendeIf condition={newUserStates}>
                            <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center gap-4">Nome:</label>
                            </div>
                            <div className="mt-2">
                                <InputText className="w-full"
                                            id="nome"
                                            name="nome"
                                            value={values.nome}
                                            onChange={handleChange}
                                            placeholder="Digite seu Nome"/>
                                    <FieldError error={errors.nome}/> 
                            </div>

                        </RendeIf>
                        
                        <RendeIf condition={newUserStates}>
                            <div className="flex items-center gap-4">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Telefone:</label>
                            </div>

                            <div className="mt-2">
                                <InputText className="w-full"
                                            id="telefone"
                                            name="telefone"
                                            value={values.telefone}
                                            onChange={handleChange}
                                            placeholder="Digite seu Número"/>
                                        <FieldError error={errors.telefone}/>
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
                                    <FieldError error={errors.login}/>
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
                                    <FieldError error={errors.senha}/>
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
                                        value={values.confirmarSenha}
                                        onChange={handleChange}
                                        placeholder="Confirme sua Senha"/>
                                    <FieldError error={errors.confirmarSenha}/>
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

                            <RendeIf condition={!newUserStates}>
                                <div className="mt-4 flex justify-center">
                                    <GoogleOAuthProvider clientId="299016155532-2ni3ks08l2lrraugdn1delclh1cru4bc.apps.googleusercontent.com">
                                        <GoogleLogin
                                            onSuccess={handleLoginGoogleSucesso}
                                            onError={() => alert("Falha na comunicação com o Google")}
                                            theme="filled_blue"
                                            shape="pill"
                                            text="signin_with"
                                        />
                                    </GoogleOAuthProvider>
                                </div>                                
                            </RendeIf>
                        </div>
                    </form>
                </div>
            </div>
        </Template>
        
    )
}