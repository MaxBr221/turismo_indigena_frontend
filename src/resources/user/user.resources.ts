export class Usuario {
    nome?: string
    telefone?: string;
    login?: string;
    senha?: string;
}

export class Credencial{
    login?: string;
    senha?: string;

}

export class TokenAcesso{
    tokenAcesso?: string;
}

export class UsuarioSessaoToken{
    nome?: string;
    login?: string;
    token?: string;
    expiracao?: number;
}