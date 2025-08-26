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
import { showToast } from "@/lib/showToast"
import { zSchema } from "@/lib/zodSchema"
import Logo from "@/public/heart.png"
import { WEBSITE_FORGOT_PASSWORD, WEBSITE_HOME, WEBSITE_SIGNUP } from "@/routes/WebsiteRoutes"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Eye, EyeClosed } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"


const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)


    const formSchema = zSchema.pick({
        email: true,
    }).extend({
        password: z.string().min(8, "please enter valid password..!")
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const onSubmit = async (value: any) => {
        try {
            setLoading(true)
            const { data: loginResponse } = await axios.post("/api/authentication/login", value);
            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (loginResponse.success) {
                setLoading(false);
                window.location.href = WEBSITE_HOME;
            } else {
                setLoading(false)
                alert(loginResponse.message)
                form.reset();
                showToast({ type: "success", message: loginResponse.message })
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
            form.reset();
        }

    }

    return (
        <div>
            <Card className="w-[450px]">
                <CardContent>
                    <div >
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
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                                            onClick={() => setShowPassword(!showPassword)}>
                                                            {showPassword ?
                                                                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" /> :
                                                                <EyeClosed className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                                                            }
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <ButtonLoading className="w-full cursor-pointer" type="submit" text="Login" loading={form.formState.isSubmitting} />
                            </form>
                            <div className="flex items-center justify-between">
                                <p>Don&apos;t have an account? <span className="text-primary cursor-pointer">
                                    <Link href={WEBSITE_SIGNUP}>
                                        Sign Up
                                    </Link>
                                </span></p>
                                <Link href={WEBSITE_FORGOT_PASSWORD}>
                                    <span className="text-primary cursor-pointer">
                                        Forgot Password ?
                                    </span>
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