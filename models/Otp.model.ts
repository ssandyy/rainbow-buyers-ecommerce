import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
}, { timestamps: true })

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // afetr 10 min it will get deleted on mongodb as well 

const OTPModel = mongoose.models.OTP || mongoose.model("OTP", otpSchema, "otp"); // if available mongoose.models.OTP else will create OTP

export default OTPModel;




