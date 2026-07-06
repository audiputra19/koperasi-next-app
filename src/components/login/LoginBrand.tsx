import Image from "next/image";

export default function LoginBrand() {
    return (
        <div className="p-20 bg-primary rounded-r-xl">
            <div className="flex flex-col gap-5 justify-center items-center">
                <div className="relative flex justify-center items-center">
                    <div className="absolute bg-gradient-to-t from-primary from-30% to-blue-400 w-80 h-80 rounded-full"></div>
                    <div className="absolute bg-gradient-to-t from-primary to-blue-400 w-50 h-50 rounded-full"></div>
                    <Image 
                        src="/images/login-image.png"
                        alt="Login Image"
                        width={300}
                        height={300}
                        className="z-999"
                        priority
                    />
                </div>
                <div className="flex flex-col gap-1 text-center">
                    <h1 className="text-white font-bold text-lg">Smarter Way to Your Cooperative</h1>
                    <p className="text-gray-300 text-xs">Easily manage your members, savings, loans, transactions, and reports. Perfect for cooperatives of all sizes.</p>
                </div>
            </div>
        </div>
    )
}