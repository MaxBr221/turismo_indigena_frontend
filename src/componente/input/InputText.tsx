import React from "react";

// Estendemos as propriedades nativas. Não precisamos mais declarar o 'style' na mão,
// pois o 'InputHTMLAttributes' já traz o 'className' (string) por padrão!
interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // Se você quiser manter uma propriedade customizada separada, mude o nome para evitar conflito:
    customStyle?: string; 
}

export const InputText: React.FC<InputTextProps> = ({
    className,     // Capturamos o que vier no className
    type = "text", 
    ...props       // O ...props captura todo o resto (id, name, value, onChange, placeholder)
}: InputTextProps) => {
    
    return (
        <input
            type={type} 
            {...props} // Repassa 'name', 'value' e 'onChange' perfeitamente para o Formik
            // Mesclamos as classes padrões com as classes que você passar na LoginPage
            className={`border px-3 py-2 rounded-lg text-gray-900 ${className || ''}`} 
        />
    );
};