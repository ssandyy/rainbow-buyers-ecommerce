import mongoose from "mongoose";

const mongoCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    deleted_At: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.models.Category || mongoose.model("Category", mongoCategorySchema, "categories");

export default CategoryModel;