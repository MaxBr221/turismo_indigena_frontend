import {Template} from '@/componente/Template'
import { Button } from '@/componente/button/Button'
import { InputText } from "@/componente/input/InputText";



export default function RestaurantePage(){
    
    return(
        <Template>
            <div className='text-center'>
                <div>
                    <h2>Restaurantes</h2>
                </div>

                <div>


                    <InputText placeholder="Digite o nome do Restaurante"/>

                </div>

            
                <div>
                    <InputText placeholder="Escolha o Local"/>

                    <select className="boder px-4 py-2">
                        <option>PRAIA</option>
                        <option>RIO</option>
                        <option>CENTRO</option>
                        <option>ALDEIA</option>
                    </select>
                    <Button style="bg-blue-200" label="label"/>


                </div>

            </div>    
     

        </Template>
    )
}
