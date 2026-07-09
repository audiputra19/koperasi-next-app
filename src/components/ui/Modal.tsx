'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/src/lib/cn";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.21, 1.02, 0.43, 1.01] }}
                        onClick={(e) => e.stopPropagation()} 
                        className={cn(
                            "w-full max-w-[500px] rounded-lg border border-base-300 bg-base-100 shadow-2xl overflow-hidden flex flex-col",
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-base-300 p-4">
                            <h3 className="text-lg font-bold text-base-content">{title}</h3>
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="p-2 rounded-full cursor-pointer hover:bg-base-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 max-h-[80vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}