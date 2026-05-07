import { Template } from "@/componente/Template";
import { useState } from "react";




export default function LoginPage(){
    const [newUserStates, setNewUserStates] = useState<boolean> (true);

    async function onSubmit(params:type) {
        const login = ""
        
    }
    return(
        <Template>
            <div className="min-h-screen w-full text-center mt-4">
                <div className="mt-4 py-3">
                    <h2 className="font-bold">Login</h2>
                </div>

                <div>
                    <form action="">
                        <label></label>



                    </form>



                </div>






            </div>


        </Template>
    )
}