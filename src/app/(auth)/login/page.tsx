import LoginBrand from "@/src/components/login/LoginBrand";
import LoginForm from "@/src/components/login/LoginForm";

export default function LoginPage() {
    return (
        <main>
            <div className="hidden sm:block">
                <div className="flex min-h-screen items-center justify-center bg-base-200">
                    <div className="w-[950px] border border-base-300 rounded-xl">
                        <div className="grid grid-cols-2">
                            <LoginForm />
                            <div className="hidden sm:block">
                                <LoginBrand />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE SCREEN */}
            <div className="sm:hidden">
                <LoginForm />
            </div>
        </main>
    )
}