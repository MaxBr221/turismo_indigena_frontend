import React from "react"

interface ButtonProps {
    style?: string;
    label?: string;
    onClick?: (event: any) => void;
    type?: "submit" | "button" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
    onClick, style, label, type = "submit"
}: ButtonProps) => {
    return (
        <button 
            className={`${style} text-white px-4 py-2 rounded-lg`} 
            onClick={onClick} 
            type={type}
        >
            {label}
        </button>
    )
}