import { Footer } from "./Footer"
import { Header } from "./Header"

interface TemplateProps{
    children: React.ReactNode
    loading?: boolean
}


export const Template: React.FC<TemplateProps> = ({children, loading = true}: TemplateProps) =>{
    return(
        <>
        
            <div className="flex flex-col min-h-screen w-full">
                <Header/>

                    <main className="flex-1">
                        {children}

                    </main>

                <Footer/>
                
            </div>
        </>    
    )
}
interface RenderIfProps{
    condition?: boolean;
    children: React.ReactNode;

}
export const RendeIf: React.FC<RenderIfProps> = ({condition = true, children}) =>{
    if(condition){
        return children;
    }
    return false;
}