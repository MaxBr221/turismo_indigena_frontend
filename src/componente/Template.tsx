import { Footer } from "./Footer"
import { Header } from "./Header"

interface TemplateProps{
    children: React.ReactNode
}


export const Template: React.FC<TemplateProps> = (props: TemplateProps) =>{
    return(
        <>
<<<<<<< HEAD
            <Header/>

            
            {props.children}

            <Footer/>
            
=======
            //importado
            //header
            
            <Header/>

            
            //conteudo
            {props.children}

            <Footer/>
            //importado
            //footer

>>>>>>> 34defce9b71b9542e9ab09a4585bd1722326bc9b
        </>
    )
}