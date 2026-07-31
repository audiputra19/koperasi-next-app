"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/src/lib/cn";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const config: Record<ToastType, { icon: React.ReactNode; className: string }> = {
    success: {
        icon: <CheckCircle2 size={20} />,
        className: "bg-success/90 text-success-content",
    },
    error: {
        icon: <XCircle size={20} />,
        className: "bg-error/90 text-error-content",
    },
    warning: {
        icon: <AlertTriangle size={20} />,
        className: "bg-warning/90 text-warning-content",
    },
    info: {
        icon: <Info size={20} />,
        className: "bg-info/90 text-info-content",
    },
};

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClose = useCallback(() => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const enterTimer = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(enterTimer);
    }, []);

    useEffect(() => {
        const dismissTimer = setTimeout(() => handleClose(), duration);
        return () => clearTimeout(dismissTimer);
    }, [duration, handleClose]);

    const { icon, className } = config[type];

    return (
        <div
            className={cn(
                "flex items-center gap-3 w-full sm:min-w-[280px] sm:max-w-sm px-4 py-3 rounded-lg shadow-lg pointer-events-auto",
                "transition-all duration-300 ease-out",
                className,
                isLeaving
                    ? "opacity-0 translate-x-full scale-95"
                    : isVisible
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-full scale-95"
            )}
        >
            <span className="shrink-0">{icon}</span>
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={handleClose}
                className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    );
}