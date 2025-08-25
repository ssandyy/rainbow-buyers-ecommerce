import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "moderator", "admin", "superadmin"],
        default: "user"
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    avatar: {
        url: {
            type: String,
            trim: true
        },
        public_id: {
            type: String,
            trim: true
        }
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true });


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // not modified then pass
    this.password = await bcrypt.hash(this.password, 10); // if modified then hash
    next();
})


UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}


export default mongoose.models.User || mongoose.model("User", UserSchema, "users");