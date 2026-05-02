import React from "react"

interface InputTextProps{
    style?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    value?: string;
    type?: string;
    id?: string;

}

export const InputText: React.FC<InputTextProps> = ({
    onChange, style, placeholder, value, type, id
} : InputTextProps) =>{
    return(
        <input
            id={id}
            type={type}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            className={`${style} text-white px-3 py-2 rounded-lg text-gray-900`}        
        />
    )

}