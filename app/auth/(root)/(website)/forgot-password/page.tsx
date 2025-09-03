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
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

const ForgotPasswordpage = () => {
    const [success, setSuccess] = useState("")

    const formSchema = zSchema.pick({
        email: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: any) => {
        console.log("Submitting...", data)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        showToast({ type: "success", message: "Password reset instructions sent" })
        setSuccess("Check your inbox for further instructions");


    }


    return (
        <div>
            <Card className="w-[450px]">
                <CardContent>
                    <div >
                        <Image className="max-w-[100px] mx-auto" src={Logo.src} width={100} height={100} alt="logo" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Forgot Password ? </h1>
                        <p>Recover back your password by verifying your email</p>
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
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="registered@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage>
                                                    {form.formState.errors.email?.message ||
                                                        (success &&
                                                            <span className="text-primary">
                                                                {success}
                                                            </span>
                                                        )
                                                    }
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <ButtonLoading className="w-full cursor-pointer" type="submit" text="Recover Password" loading={form.formState.isSubmitting} />
                            </form>
                            <div>
                                <p>Back to Login? <span className="text-primary cursor-pointer">
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

export default ForgotPasswordpage