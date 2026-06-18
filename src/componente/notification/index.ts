'use client';
import { toast } from 'sonner' 

export const notification = () =>{
    function notify(message: string, level: "success" | "info" | "warning" | "error" ){
        toast.dismiss();
        toast[level](message);
    }
    return {
        notify
    }
}