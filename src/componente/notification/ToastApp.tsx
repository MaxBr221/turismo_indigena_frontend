'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // O CSS precisa ser importado aqui!

export default function ToastApp() {
  return (
    <ToastContainer 
        position='top-right'
        autoClose={8000}
        hideProgressBar={false}
        draggable={false}
        closeOnClick={true}
        pauseOnHover={true}
    />
  )
}