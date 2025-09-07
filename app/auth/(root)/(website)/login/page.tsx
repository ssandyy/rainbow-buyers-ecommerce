"use client"
import { ButtonLoading } from "@/components/application/ButtonLoading"
import { BorderBeam } from "@/components/magicui/border-beam"
import { Card, CardContent } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { response } from "@/lib/apiHelperFunctions"
import { showToast } from "@/lib/showToast"
import { zSchema } from "@/lib/zodSchema"
import Logo from "@/public/heart.png"
import { WEBSITE_FORGOT_PASSWORD, WEBSITE_HOME, WEBSITE_SIGNUP } from "@/routes/WebsiteRoutes"
import { login } from "@/store/reducer/authReducer"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Eye, EyeClosed } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import z from "zod"


const LoginPage = () => {
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const [loadingLogin, setLoadingLogin] = useState(false)
    const { theme } = useTheme()


    const formSchema = zSchema.pick({
        email: true,
    }).extend({
        password: z.string().min(8, "please enter valid password..!"),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (value: any) => {
        try {
            setLoadingLogin(true)
            const { data: loginResponse } = await axios.post("/api/authentication/login", value)
            await new Promise((resolve) => setTimeout(resolve, 300))

            // OTP flow - redirect to OTP page
            if (loginResponse.success && (loginResponse.message || "").toLowerCase().includes("otp")) {
                showToast({ type: "info", message: loginResponse.message })
                router.push(`/auth/verify-otp?email=${encodeURIComponent(value.email)}`)
                return response({ success: true, statusCode: 200, message: loginResponse.message, data: loginResponse.data });
            }

            // Normal login
            if (loginResponse.success) {
                console.log(loginResponse);
                showToast({ type: "success", message: loginResponse.message || "Login successfully" })
                dispatch(login(loginResponse.data))
                router.push(WEBSITE_HOME)
                return response({ success: true, statusCode: 200, message: loginResponse.message || "Login successfully", data: loginResponse.data });
            }

            showToast({ type: "warning", message: loginResponse.message || "Please verify your email before login." })
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Something went wrong, maybe internal server error..!"
            showToast({ type: "error", message: msg })
            console.log(error)
        } finally {
            setLoadingLogin(false)
        }
    }


    return (
        <div className="flex items-center justify-center h-screen p-2">

            <Card className="relative w-[450px] overflow-hidden rounded-2xl">


                <CardContent>
                    <div>
                        <Image className="max-w-[100px] mx-auto" src={Logo.src} width={100} height={80} alt="logo" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Rainbow Buyers</h1>
                        <p>Login with your email and password</p>
                    </div>
                    <Separator orientation="horizontal" className="text-gray-400" />
                    <div className="mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registered Email:</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="example@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                                                        <div
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? (
                                                                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                                                            ) : (
                                                                <EyeClosed className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <ButtonLoading
                                    className="w-full cursor-pointer"
                                    type="submit"
                                    text="Login"
                                    loading={form.formState.isSubmitting || loadingLogin}
                                />
                            </form>
                            <div className="flex items-center justify-between mt-4">
                                <p>
                                    Don&apos;t have an account?{" "}
                                    <span className="text-primary cursor-pointer">
                                        <Link href={WEBSITE_SIGNUP}>Sign Up</Link>
                                    </span>
                                </p>
                                <Link href={WEBSITE_FORGOT_PASSWORD}>
                                    <span className="text-primary cursor-pointer">Forgot Password ?</span>
                                </Link>
                            </div>
                        </Form>
                    </div>
                </CardContent>
                <BorderBeam
                    duration={6}
                    size={400}
                    className="from-transparent via-red-500 to-transparent"
                />
                <BorderBeam
                    duration={6}
                    delay={3}
                    size={400}
                    borderWidth={2}
                    className="from-transparent via-blue-500 to-transparent"
                />
            </Card>
        </div >
    )
}

export default LoginPage
