'use client'

import { useEffect, useState } from "react";
import { Live2d } from './components/live2d';
import ChatBot from './components/chatbot';
import { Header } from './components/header';
import { useAppConfig } from "./hooks/appConfig";
import { useAuthStore } from "@/lib/store/auth";
import { Spinner } from "@heroui/react";
import AuthModal from "@/components/auth/AuthModal";


export default function App() {
    const { setAppConfig } = useAppConfig();
    const { isAuthenticated } = useAuthStore();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showAuthModal, setShowAuthModal ] = useState(false);
    
    useEffect(() => {
        setAppConfig(null);
        setIsLoading(false);
        
        if (!isAuthenticated) {
            setShowAuthModal(true);
        }
    }, [isAuthenticated])

    return (
        <div className='w-full h-full'>
            {
                isLoading ?
                <Spinner className="w-screen h-screen z-10" color="secondary" size="lg" variant="wave" />
                :
                <div className='flex flex-col w-full h-full'>
                    <Header />
                    <ChatBot />
                </div>
            }
            <Live2d />
            <AuthModal 
                isOpen={showAuthModal && !isAuthenticated} 
                onClose={() => setShowAuthModal(false)} 
            />
        </div>
    );
}
