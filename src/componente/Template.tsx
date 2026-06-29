'use client'
import { Footer } from "./Footer"
import { Header } from "./Header"

interface TemplateProps{
    children: React.ReactNode
    loading?: boolean
}


export const Template: React.FC<TemplateProps> = ({children, loading = true}) =>{
    return(
        <div className="flex flex-col min-h-screen w-full bg-[#FDFBF7] font-sans selection:bg-[#57C5B6]/30">
            <Header/>
                <main className="flex-1 container mx-auto">
                    {children}
                </main>
            <Footer/>
        </div>
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