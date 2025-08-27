"use client"
import { ButtonLoading } from "@/components/application/ButtonLoading"
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
import { response } from "@/lib/apiHelperFunctions"
import { showToast } from "@/lib/showToast"
import { zSchema } from "@/lib/zodSchema"
import Logo from "@/public/heart.png"
import { WEBSITE_FORGOT_PASSWORD, WEBSITE_HOME, WEBSITE_SIGNUP } from "@/routes/WebsiteRoutes"
import { login } from "@/store/reducer/authReducer"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Eye, EyeClosed } from "lucide-react"
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
    const [showOTPInput, setShowOTPInput] = useState(false)
    const [otp, setOtp] = useState("")
    const [lastEmail, setLastEmail] = useState("")
    const router = useRouter()
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingVerify, setLoadingVerify] = useState(false)
    const [loadingResend, setLoadingResend] = useState(false)

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

            // OTP flow
            if (loginResponse.success && (loginResponse.message || "").toLowerCase().includes("otp")) {
                setLastEmail(value.email)
                setShowOTPInput(true)
                showToast({ type: "info", message: loginResponse.message })
                return response({ success: true, statusCode: 200, message: loginResponse.message, data: loginResponse.data });
            }

            // Normal login
            if (loginResponse.success) {
                console.log(loginResponse);
                showToast({ type: "success", message: loginResponse.message || "Login successfully" })
                // dispatch(login(loginResponse.data))
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

    const verifyOtp = async () => {
        try {
            if (!otp || otp.length < 4) {
                showToast({ type: "warning", message: "Please enter the OTP sent to your email" })
                return
            }
            setLoadingVerify(true)

            const { data } = await axios.post("/api/authentication/verify-login-otp", {
                email: lastEmail,
                otp,
            })




            if (data.success) {
                showToast({ type: "success", message: data.message || "OTP verified. Logging you in..." })
                dispatch(login(data.data))
                router.push(WEBSITE_HOME)
            } else {
                showToast({ type: "error", message: data.message || "Invalid or expired OTP" })
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "OTP verification failed"
            showToast({ type: "error", message: msg })

        } finally {
            setLoadingVerify(false)
        }
    }

    const resendOtp = async () => {
        try {
            setLoadingResend(true)
            const { data } = await axios.post("/api/authentication/resend-otp", { email: lastEmail })
            if (data.success) {
                showToast({ type: "success", message: data.message || "OTP resent successfully" })
                console.log("OTP verification response:", data)
            } else {
                showToast({ type: "warning", message: data.message || "Could not resend OTP" })
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to resend OTP"
            showToast({ type: "error", message: msg })
        } finally {
            setLoadingResend(false)
        }
    }

    return (
        <div>
            <Card className="w-[450px]">
                <CardContent>
                    <div>
                        <Image className="max-w-[100px] mx-auto" src={Logo.src} width={100} height={100} alt="logo" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Login Into Account</h1>
                        <p>Login with your email and password</p>
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
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

                                {!showOTPInput && (
                                    <ButtonLoading
                                        className="w-full cursor-pointer"
                                        type="submit"
                                        text="Login"
                                        loading={form.formState.isSubmitting || loadingLogin}
                                    />
                                )}

                                {showOTPInput && (
                                    <div>
                                        <div className="space-y-3">
                                            <div>
                                                <FormLabel>Enter OTP</FormLabel>
                                                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                                            </div>
                                            <div className="flex gap-2">
                                                <ButtonLoading
                                                    className="w-full"
                                                    type="button"
                                                    text="Verify OTP"
                                                    loading={loadingVerify}
                                                    onClick={verifyOtp}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <ButtonLoading
                                                className="w-full"
                                                type="button"
                                                text="Resend OTP"
                                                loading={loadingResend}
                                                onClick={resendOtp}
                                            />
                                        </div>
                                    </div>
                                )}
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
            </Card>
        </div>
    )
}

export default LoginPage
