import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        required: true,
        trim: true
    },
    public_id: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail_url: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    alt: {
        type: String,
        trim: true
    },
    deleted: {
        type: Date,
        default: null,
        index: true
    },

}, { timestamps: true })


const MediaModel = mongoose.models.Media || mongoose.model("Media", mediaSchema, "media"); // if available mongoose.models.Media else will upload media

export default MediaModel;




