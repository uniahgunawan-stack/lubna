'use client'

import { useEffect, useState } from "react";
import AuthModal from "@/components/AuthModal";
import PreviewModal from "@/components/PreviewModal";
import { useAuth } from "@/hooks/use-auth";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { isLoggedIn, isAuthLoading } = useAuth();

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            if (!isAuthLoading) {
                const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
                if (!hasSeenModal && !isLoggedIn) {
                    setIsAuthModalOpen(true);
                }
            }
        }
        
    }, [isAuthLoading, isLoggedIn]);

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
        localStorage.setItem('hasSeenWelcomeModal', 'true');
    }

    if (!isMounted) {
        return null;
    }

    return (
        <>
        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={handleCloseAuthModal}
        />
        <PreviewModal /> 
        </>
    );
}

export default ModalProvider;
