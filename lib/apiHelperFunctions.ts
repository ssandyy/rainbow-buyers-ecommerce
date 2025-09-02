import { NextResponse } from "next/server";

export const response = ({
    success,
    statusCode,
    message,
    data = {}
}: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
}) => {
    return NextResponse.json(
        {
            success,
            statusCode,
            message,
            data,
        },
        { status: statusCode }
    );
};

export const catchError = ({
    error,
    customMessage,
}: {
    error: any;
    customMessage?: string;
}) => {
    let statusCode = 500;
    let message = customMessage || "Something went wrong, maybe internal server error..!";

    // Handle known cases
    if (error.code === 11000) {
        // duplicate key
        const keys = Object.keys(error.keyPattern || {}).join(", ");
        statusCode = 400;
        message = `Duplicate field(s): ${keys}, must be unique.`;
    } else if (error.name === "ValidationError") {
        // validation error
        statusCode = 400;
        message = error.message;
    } else if (error.statusCode) {

        statusCode = error.statusCode;
        message = error.message || message;
    }

    const errorObject =
        process.env.NODE_ENV === "development"
            ? { message, stack: error.stack, error }
            : { message };

    return response({
        success: false,
        statusCode,
        message,
        data: errorObject,
    });
};


export const generateOTP = () => {
    // Exactly 6 digits: 100000 - 999999
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}


export const isAuthenticated = async (role: string) => {
    const auth = true;
    return auth;
}