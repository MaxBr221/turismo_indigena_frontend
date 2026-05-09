import { Footer } from "./Footer"
import { Header } from "./Header"

interface TemplateProps{
    children: React.ReactNode
}


export const Template: React.FC<TemplateProps> = (props: TemplateProps) =>{
    return(
        <div className="flex flex-col min-h-screen w-full">
            <Header/>

                <main className="flex-1">
                    {props.children}

                </main>

            <Footer/>
            
        </div>
    )
}