import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, required: true },
        mrp: { type: Number, required: true, },
        sellingPrice: { type: Number, required: true },
        discount: { type: Number, required: true },
        media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null, required: true }],
        deleted_At: { type: Date, default: null, index: true },
    },
    { timestamps: true }
);

productSchema.index({ category: 1 });

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema, "products");

export default ProductModel;