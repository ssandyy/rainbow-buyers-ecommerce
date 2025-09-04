"use client";

import BreadCrumb from "@/components/application/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/showToast";
import { CategoryInput, zSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { errors } from "jose";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";


interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    mrp: number;
    sellingPrice: number;
    discount: number;
    media: string[];

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
    const formSchema = zSchema.pick({
        name: true,
        slug: true,
        description: true,
        mrp: true,
        sellingPrice: true,
        discount: true,
        media: true,
    });


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            mrp: 0,
            sellingPrice: 0,
            discount: 0,
            media: []
        }
    })




    useEffect(() => {
        setValue(
            "slug",
            slugify(name || "", { lower: true, strict: true }),
            { shouldValidate: true }
        );
    }, [name, setValue]);

    const onSubmit = async (values: CategoryInput) => {
        setLoading(true);
        try {
            const { data: response } = await axios.post('/api/category/create', values);

            if (!response.success) {
                showToast({ message: response.message, type: "error" });
            }
            form.reset();
            showToast({ message: "Product added successfully", type: "success" });

        } catch (error) {
            showToast({ message: "Something went wrong", type: "error" });
        } finally {
            setLoading(false);
        }
    }



    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>
                        {initialData ? "Edit Product" : "Add Product"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <Input placeholder="Product name" {...register("name")} />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Input placeholder="Slug" {...register("slug")} />
                            {errors.slug && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.slug.message}
                                </p>
                            )}
                        </div>


                        <Button type="submit" className="w-full">
                            {initialData ? "Update" : "Add"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddProduct;
