import React from "react";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    customStyle?: string; 
}

export const InputText: React.FC<InputTextProps> = ({
    className,     
    type = "text", 
    ...props     
}: InputTextProps) => {
    
    return (
        <input
            type={type} 
            {...props} 
            className={`border px-3 py-2 rounded-lg text-gray-900 ${className || ''}`} 
        />
    );
};