import * as Yup from 'yup'

export interface LoginForm{
    nome?: string;
    login: string;
    telefone?: string;
    senha: string;
    confirmarSenha?: string;
}

export const validationScheme = Yup.object().shape({
    login: Yup.string().trim().required("É preciso digitar o login").email("Login inválido"),
    senha: Yup.string().required("É preciso digitar a senha").min(8, "A senha precisa ter no minimo 8 caracteres"),
    confirmarSenha: Yup.string()
        .notRequired()
        .oneOf([Yup.ref("senha"), ""], "As senhas devem ser iguais!") 
})

export const formScheme: LoginForm = {nome: '', login: '', telefone: '', senha: '', confirmarSenha: ''}