import { Footer } from "./Footer"
import { Header } from "./Header"

interface TemplateProps{
    children: React.ReactNode
}


export const Template: React.FC<TemplateProps> = (props: TemplateProps) =>{
    return(
        <>
            <Header/>

            
                {props.children}

            <Footer/>
            
        </>
    )
}