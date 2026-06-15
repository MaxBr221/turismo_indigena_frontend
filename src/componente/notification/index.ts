'use client';
import { toast } from 'sonner' 

export const userNotification = () =>{
    function notify(message: string, level: "success" | "info" | "warning" | "error" ){
        toast.dismiss();
        toast[level](message);
    }
    return {
        notify
    }
}