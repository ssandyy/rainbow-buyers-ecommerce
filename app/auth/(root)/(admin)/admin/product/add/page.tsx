"use client";

import MediaModal from "@/components/application/Admin/MediaModal";
import SelectedMediaPreview from "@/components/application/Admin/SelectedMediaPreview";
import BreadCrumb from "@/components/application/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch";
import { showToast } from "@/lib/showToast";
import { productSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import slugify from "slugify";


interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    mrp: number;
    sellingPrice: number;
    discount: number;
    media: string[];
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    parentName?: string | null;
}

interface CategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        data: Category[];
        meta: { totalRowCount: number };
    };
}
type Props = {
    onSubmit: (data: Omit<Product, "id">, id?: string) => void;
    initialData?: Product | null;
};

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_PRODUCT_SHOW, label: "Product" },
    { href: "", label: "Add" },
];


const AddProduct = ({ initialData }: Props) => {
    const [loading, setLoading] = useState(false);

    const [categoryOptions, setCategoryOptions] = useState<
        { value: string; label: string }[]
    >([]);

    const { data } = useFetch<CategoryResponse>("/api/category");

    const [open, setOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

    const handleRemoveMedia = (mediaId: string) => {
        setSelectedMedia(prev => prev.filter(id => id !== mediaId));
        // Validation will be triggered by the useEffect with debounce
    };

    useEffect(() => {
        if (data?.success) {
            setCategoryOptions(
                data.data.data.map((cat: Category) => ({
                    value: cat._id,
                    label: cat.name,
                }))
            );
        }
    }, [data]);





    // useEffect(() => {
    //     if (getCategory && getCategory.data.success) {
    //         setCategoryOptions(
    //             getCategory.data.data.map((cat: Category) => ({
    //                 value: cat._id,
    //                 label: cat.name,
    //             }))
    //         );
    //     }
    // }, [getCategory])


    // const { data: getCategory } = useFetch<{
    //     success: boolean;
    //     statusCode: number;
    //     message: string;
    //     data: {
    //         data: Category[];
    //         meta: { totalRowCount: number };
    //     };
    // }>("/api/category");
    // console.log(getCategory);
    // const categoryOptions =
    //     getCategory?.data?.data?.map((cat) => ({
    //         value: cat._id,
    //         label: cat.name,
    //     })) || [];
    // console.log(categoryOptions);






    const formSchema = productSchema.pick({
        name: true,
        slug: true,
        description: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discount: true,
    });


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            category: [],
            mrp: 0,
            sellingPrice: 0,
            discount: 0
        }
    })

    const { register, watch, setValue, handleSubmit, formState } = form;

    const { errors } = formState;

    const name = watch("name");

    useEffect(() => {
        const name = form.getValues("name");

        if (name) {
            setValue("slug", slugify(name, { lower: true, strict: true }));
        }
    }, [form.watch('name')]);


    const onSubmit = async (values: any) => {
        // Validate media selection before submission
        if (selectedMedia.length === 0) {
            showToast({ message: "Please select at least one image", type: "error" });
            return;
        }

        setLoading(true);

        try {
            // Include selected media in the form data
            const formData = {
                ...values,
                media: selectedMedia
            };

            const { data: response } = await axios.post('/api/product/create', formData);

            if (!response.success) {
                showToast({ message: response.message, type: "error" });
                return;
            }

            form.reset();
            setSelectedMedia([]);
            showToast({ message: "Product added successfully", type: "success" });

        } catch (error) {
            showToast({ message: "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    }
    type Option = { value: string; label: string };


    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="rounded-xl shadow-lg border border-purple-500 bg-white/80 backdrop-blur-sm mt-2">
                <CardHeader className="border-b text-center justify-center">
                    <CardTitle className="text-xl font-semibold text-gray-800 py-0">
                        {initialData ? "Edit Product" : "Add New Product"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="px-6 ">
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-1 gap-6"
                        >
                            {/* Row 1: Product Name, Slug, Category */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                                    <Input
                                        placeholder="Enter product name"
                                        {...register("name")}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Slug</label>
                                    <Input
                                        placeholder="auto-generated slug"
                                        {...register("slug")}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                                </div>

                                <div className="flex flex-col space-y-2  rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500">
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <Controller
                                        name="category"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select<Option, true>
                                                {...field}
                                                isMulti
                                                options={categoryOptions}
                                                className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500 basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={(selected) => field.onChange(selected.map((opt) => opt.value))}
                                                value={categoryOptions.filter((opt) => field.value?.includes(opt.value))}
                                            />
                                        )}
                                    />
                                    {errors.category && (
                                        <p className="text-red-500 text-sm">{errors.category.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: MRP, Selling Price, Discount */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">MRP</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter MRP"
                                        {...register("mrp")}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp.message}</p>}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Selling Price</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter selling price"
                                        {...register("sellingPrice")}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.sellingPrice && <p className="text-red-500 text-sm">{errors.sellingPrice.message}</p>}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter discount"
                                        {...register("discount")}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    />
                                    {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
                                </div>
                            </div>

                            {/* Row 3: Description */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Description</label>
                                <textarea
                                    placeholder="Write product description..."

                                    {...register("description")}
                                    className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500 min-h-[100px] p-3"
                                />

                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            {/* Row 4: Images */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Images</label>
                                <div className="relative cursor-pointer">
                                    <Input
                                        type="text"
                                        placeholder={selectedMedia.length > 0 ? `${selectedMedia.length} image(s) selected` : "Select Product Images"}
                                        value={selectedMedia.length > 0 ? `${selectedMedia.length} image(s) selected` : ""}
                                        className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                        readOnly
                                        onClick={() => setOpen(true)}
                                    />
                                    <MediaModal isMultiple={true} open={open} setOpen={setOpen} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} />
                                </div>

                                {/* Media Preview */}
                                <SelectedMediaPreview
                                    selectedMediaIds={selectedMedia}
                                    onRemove={handleRemoveMedia}
                                />

                                {selectedMedia.length === 0 && (
                                    <p className="text-red-500 text-sm">At least one media is required</p>
                                )}
                            </div>

                            {/* Row 5: Buttons */}
                            <div className="flex space-x-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md transition"
                                >
                                    {loading ? "Adding..." : (initialData ? "Update Product" : "Add Product")}
                                </Button>
                                <Button
                                    type="reset"
                                    variant="outline"
                                    className="cursor-pointer flex-1 rounded-xl border-amber-500 text-amber-600 hover:bg-amber-50"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>


        </div >
    );
};

export default AddProduct;
