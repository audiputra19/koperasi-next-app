'use client';

import logo from '@/public/images/koperasi-logo.jpg';
import { login } from "@/src/features/auth/action";
import { AuthState } from "@/src/types/auth";
import { Eye, EyeOff, LockKeyhole, ShieldUser } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useToast } from '@/src/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const initialState: AuthState = {};
    const [state, formAction, isPending] = useActionState(login, initialState);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { showToast } = useToast();
    const router = useRouter();

    const handleShowPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    }

    useEffect(() => {
        if (state?.success) {
            showToast(typeof state.success === "string" ? state.success : "Login Berhasil.", "success");
            if (state.redirectTo) {
                router.push(state.redirectTo);
            }
        }
        if (state?.error) {
            showToast(state.error, "error");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return (
        <div className="relative p-10 sm:p-20 bg-base-100 rounded-l-xl flex flex-col sm:justify-center">
            <form action={formAction}>
                <div className="flex items-center gap-2 text-base-content">
                    <Image 
                        src={logo}
                        alt="Login Image"
                        width={30}
                        height={30}
                        className="z-999"
                        priority
                    />
                    <p className="font-bold">Kopsa</p>
                </div>
                <div className="sm:hidden flex justify-center">
                    <Image 
                        src="/images/login-image.png"
                        alt="Login Image"
                        width={300}
                        height={300}
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="flex flex-col gap-1 mt-6">
                    <h1 className="font-bold text-xl">Log in to your Account</h1>
                    <p className="text-sm text-gray-500">Welcome back! Please log in</p>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                    <label className="input w-full">
                        <ShieldUser size={20} className="text-gray-400" />
                        <input 
                            type="text" 
                            name="userId"
                            className="grow" 
                            placeholder="ID User" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </label>
                    <label className="input w-full">
                        <LockKeyhole size={20} className="text-gray-400" />
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            name="password"
                            className="grow" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            className="text-gray-400 cursor-pointer"
                            onClick={handleShowPassword}
                        >
                            { showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </label>
                </div>
                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={isPending}
                    >
                        Log in
                    </Button>
                </div>
            </form>
        </div>
    )
}