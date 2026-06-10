declare module 'js-cookie' {
    interface CookieAttributes {
        expires?: number | Date | undefined;
        path?: string | undefined;
        domain?: string | undefined;
        secure?: boolean | undefined;
        sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined;
        [key: string]: any;
    }

    interface CookiesStatic {
        get(name: string): string | undefined;
        get(): { [key: string]: string };
        set(name: string, value: string | object, attributes?: CookieAttributes): string | undefined;
        remove(name: string, attributes?: CookieAttributes): void;
        withAttributes(attributes: CookieAttributes): CookiesStatic;
        withConverter(converter: any): CookiesStatic;
    }

    const Cookies: CookiesStatic;
    export default Cookies;
}