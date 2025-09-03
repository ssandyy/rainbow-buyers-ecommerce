"use client"

import { ButtonLoading } from "@/components/application/ButtonLoading"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { showToast } from "@/lib/showToast"
import { zSchema } from "@/lib/zodSchema"
import Logo from "@/public/heart.png"
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Eye, EyeClosed } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"


const Signup = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const formSchema = zSchema.pick({
        name: true,
        email: true,
        password: true
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    const onSubmit = async (value: any) => {
        try {
            setLoading(true)
            const { data: registerResponse } = await axios.post("/api/authentication/register", value);

            if (registerResponse.success) {
                // Inform user to verify email
                showToast({ type: "success", message: registerResponse.message || "Registration successful. Please verify your email." })
                setLoading(false)
                setTimeout(() => {
                    window.location.href = WEBSITE_LOGIN;
                }, 1500)
            } else {
                setLoading(false)
                showToast({ type: "warning", message: registerResponse.message || "Registration failed" })
            }

        } catch (error: any) {
            setLoading(false)
            const msg = error?.response?.data?.message || "Something went wrong, maybe internal server error..!";
            showToast({ type: "error", message: msg })
            console.log(error)
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
                        <h1 className="text-3xl font-bold">Create your account</h1>
                        <p>Sign up with yourname, email and password</p>
                    </div>

                    <div className="mt-4">
                        <Form {...form}>
                            <div className="mt-2 text-center justify-center">
                                <FormMessage>
                                    {form.formState.errors.confirmPassword && form.formState.errors.confirmPassword.message}
                                </FormMessage>
                            </div>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter your name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
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
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="password" placeholder="********" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <ButtonLoading className="w-full cursor-pointer" type="submit" text="Signup" loading={form.formState.isSubmitting || loading} />

                            </form>
                            <div className="text-center justify-center ">

                                <p>Already have an account? <span className="text-primary cursor-pointer">
                                    <Link href={WEBSITE_LOGIN}>
                                        Login
                                    </Link>
                                </span></p>
                            </div>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Signup