import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";
import { useEffect } from "react";

const CategoryPage = async ({
    params
}: {
    params: { categoryId: string, storeId: string }
}) => {
    let category: any;
    
    if (params.categoryId.length > 4) {
        category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            }
        });
    } else {
    }

    let billboard: any;
    if (params.storeId.length > 4) {
        billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });
    } else {
    }
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <CategoryForm 
                    billboards={billboard}
                    initialData={category}    
                />
            </div>
        </div>
    );
}

export default CategoryPage;