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
import { CategoryInput, categorySchema } from "@/lib/zodSchema";
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";


interface Category {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;

}

type Props = {
    onSubmit: (data: Omit<Category, "id">, id?: string) => void;
    initialData?: Category | null;
};

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { href: "", label: "Add" },
];


const AddCategoryPage = ({ initialData }: Props) => {
    const form = useForm<CategoryInput>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            parentId: initialData?.parentId || null,
        },
    });
    const [loading, setLoading] = useState(false);

    const { register, watch, setValue, handleSubmit, formState } = form;
    const { errors } = formState;

    const name = watch("name");

    // ✅ Auto-generate slug when name changes (only if creating new)
    useEffect(() => {
        if (!initialData) {
            setValue(
                "slug",
                slugify(name || "", {
                    lower: true,
                    strict: true,
                }),
                { shouldValidate: true }
            );
        }
    }, [name, initialData, setValue]);

    const onSubmit = async (values: CategoryInput) => {
        setLoading(true);
        try {
            const { data: response } = await axios.post('/api/category/create', values);

            if (!response.success) {
                showToast({ message: response.message, type: "error" });
            }
            form.reset();
            showToast({ message: "Category added successfully", type: "success" });

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
                        {initialData ? "Edit Category" : "Add Category"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input placeholder="Category name" {...register("name")} />
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

export default AddCategoryPage;
