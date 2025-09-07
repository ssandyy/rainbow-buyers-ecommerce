"use client"

import { ButtonLoading } from "@/components/application/ButtonLoading"
import { BorderBeam } from "@/components/magicui/border-beam"
import { MagicCard } from "@/components/magicui/magic-card"
import { Card, CardContent } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Separator } from "@/components/ui/separator"
import { showToast } from "@/lib/showToast"
import Logo from "@/public/heart.png"
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"
import { WEBSITE_HOME, WEBSITE_LOGIN } from "@/routes/WebsiteRoutes"
import { login } from "@/store/reducer/authReducer"
import axios from "axios"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"

const VerifyOTPPage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { theme } = useTheme()
    
    const [otp, setOtp] = useState("")
    const [email, setEmail] = useState("")
    const [loadingVerify, setLoadingVerify] = useState(false)
    const [loadingResend, setLoadingResend] = useState(false)
    const [otpTimer, setOtpTimer] = useState(0)

    useEffect(() => {
        // Get email from URL params or redirect to login
        const emailParam = searchParams.get('email')
        if (!emailParam) {
            showToast({ type: "error", message: "Email not found. Please login again." })
            router.push(WEBSITE_LOGIN)
            return
        }
        setEmail(emailParam)
        setOtpTimer(60) // Start 1 minute timer
    }, [searchParams, router])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (otpTimer > 0) {
            timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [otpTimer])

    const form = useForm({
        defaultValues: {
            otp: "",
        },
    })

    const verifyOtp = async () => {
        try {
            if (!otp || otp.length < 4) {
                showToast({ type: "warning", message: "Please enter the OTP sent to your email" })
                return
            }
            setLoadingVerify(true)

            const { data } = await axios.post("/api/authentication/verify-login-otp", {
                email,
                otp,
            })

            if (data.success) {
                showToast({ type: "success", message: data.message || "OTP verified. Logging you in..." })
                dispatch(login(data.data))
                
                // Redirect based on user role
                if (data.data.role === "admin" || data.data.role === "superadmin") {
                    router.push(ADMIN_DASHBOARD)
                } else {
                    router.push(WEBSITE_HOME)
                }
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
            const { data } = await axios.post("/api/authentication/resend-otp", { email })
            if (data.success) {
                showToast({ type: "success", message: data.message || "OTP resent successfully" })
                setOtpTimer(60) // restart 1 min countdown
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
        <div className="flex items-center justify-center h-screen p-2">
            <Card className="relative w-[450px] overflow-hidden rounded-2xl">
                <CardContent>
                    <div>
                        <Image className="max-w-[100px] mx-auto" src={Logo.src} width={100} height={80} alt="logo" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Verify OTP</h1>
                        <p>Enter the OTP sent to {email}</p>
                    </div>
                    <Separator orientation="horizontal" className="text-gray-400" />
                    
                    <div className="mt-4">
                        <Form {...form}>
                            <form className="space-y-8">
                                <MagicCard
                                    gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                                    className="p-0 rounded-3xl"
                                >
                                    <div>
                                        <BorderBeam
                                            size={100}
                                            initialOffset={30}
                                            className="from-transparent gradient-radial bg-clip-border to-transparent"
                                            transition={{
                                                type: "spring",
                                                stiffness: 70,
                                                damping: 20,
                                            }}
                                        />
                                        <div className="text-center justify-center space-y-3 p-5">
                                            <FormField
                                                name="otp"
                                                render={() => (
                                                    <FormItem className="text-center justify-center">
                                                        <FormLabel className="text-center justify-center">Enter your Secret-Codes:</FormLabel>
                                                        <FormControl>
                                                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                                                <InputOTPGroup>
                                                                    <InputOTPSlot index={0} />
                                                                    <InputOTPSlot index={1} />
                                                                    <InputOTPSlot index={2} />
                                                                    <InputOTPSlot index={3} />
                                                                    <InputOTPSlot index={4} />
                                                                    <InputOTPSlot index={5} />
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex gap-2 mt-4">
                                                <ButtonLoading
                                                    className="w-full"
                                                    type="button"
                                                    text="Verify OTP"
                                                    loading={loadingVerify}
                                                    onClick={verifyOtp}
                                                />
                                            </div>
                                        </div>

                                        <Separator orientation="horizontal" className="text-gray-400" />
                                        <div className="mt-2 p-5 text-center">
                                            {otpTimer > 0 ? (
                                                <p className="text-sm text-gray-600">
                                                    Resend available in{" "}
                                                    <span className="font-semibold text-amber-500">{otpTimer}</span> sec
                                                </p>
                                            ) : (
                                                <ButtonLoading
                                                    className="w-full"
                                                    type="button"
                                                    text="Resend OTP"
                                                    loading={loadingResend}
                                                    onClick={resendOtp}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </MagicCard>
                            </form>
                            
                            <div className="flex items-center justify-center mt-4">
                                <p>
                                    Back to{" "}
                                    <span className="text-primary cursor-pointer">
                                        <Link href={WEBSITE_LOGIN}>Login</Link>
                                    </span>
                                </p>
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
        </div>
    )
}

export default VerifyOTPPage


