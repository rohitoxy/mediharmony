
import React, { useEffect, useRef } from "react";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FullScreenAlertProps {
  title: string;
  message: string;
  medicationId: string;
  isOpen: boolean;
  onClose: (medicationId: string) => void;
}

const FullScreenAlert = ({
  title,
  message,
  medicationId,
  isOpen,
  onClose,
}: FullScreenAlertProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add focus trap and keyboard listener for accessibility
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(medicationId);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Set focus to the container
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, medicationId, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-2xl p-8 rounded-lg bg-red-600 shadow-2xl"
            ref={containerRef}
            tabIndex={-1}
          >
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onClose(medicationId)}
                className="rounded-full h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white rounded-full p-4 mb-6 animate-pulse">
                <Bell className="h-10 w-10 text-red-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                {title}
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                {message}
              </p>
              
              <Button
                size="lg"
                onClick={() => onClose(medicationId)}
                className="bg-white text-red-600 hover:bg-white/90 font-bold text-lg px-8"
              >
                Acknowledge
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenAlert;
