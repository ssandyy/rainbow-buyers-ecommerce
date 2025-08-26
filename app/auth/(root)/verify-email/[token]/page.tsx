"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import verificationFailedImg from "@/public/images/verification-failed.gif";
import verifiedImg from "@/public/images/verified.gif";
import { WEBSITE_HOME } from "@/routes/WebsiteRoutes";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const VerifyEmailPage = ({ params }: { params: Promise<{ token: string }> }) => {
    // ✅ unwrap promise with React.use()
    const { token } = use(params);

    const [status, setStatus] = useState<"loading" | "success" | "already" | "failed">("loading");
    const [message, setMessage] = useState<string>("Verifying your email...");

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/authentication/verifyemailbytoken`,
                    { token }
                );

                if (data.success) {
                    if (data.message.includes("already")) {
                        setStatus("already");
                        setMessage("Your email is already verified ✅");
                    } else {
                        setStatus("success");
                        setMessage("Email Verification Successfull..! ✅");
                    }
                } else {
                    setStatus("failed");
                    setMessage(data.message || "Email Verification Failed ❌");
                }
            } catch (error: any) {
                console.error("Verification failed:", error);
                setStatus("failed");
                setMessage(
                    error.response?.data?.message || "Something went wrong. Please try again later."
                );
            }
        };

        if (token) verify();
    }, [token]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[450px] mx-4">
                <CardContent className="pt-6">
                    {status === "loading" && (
                        <div className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <h1 className="text-xl font-bold mt-4">{message}</h1>
                            <p className="text-gray-500 mt-2">Please wait while we verify your email address.</p>
                        </div>
                    )}

                    {(status === "success" || status === "already") && (
                        <div>
                            <div className="flex justify-center">
                                <Image src={verifiedImg} height={100} width={100} alt="verified" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold my-5 text-green-500">{message}</h1>
                                <p className="text-gray-600 mb-4">
                                    Thank you for verifying your email address. You can now enjoy all the features of our platform.
                                </p>
                                <Button asChild className="w-full">
                                    <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === "failed" && (
                        <div>
                            <div className="flex justify-center">
                                <Image src={verificationFailedImg} height={100} width={100} alt="verification failed" />
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold my-5 text-red-500">{message}</h1>
                                <p className="text-gray-600 mb-4">
                                    The verification link may have expired or is invalid. Please try registering again.
                                </p>
                                <Button asChild className="w-full">
                                    <Link href={WEBSITE_HOME}>Go to Homepage</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmailPage;