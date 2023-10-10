import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";
import { useEffect } from "react";

const SizePage = async ({
    params
}: {
    params: { sizeId: string }
}) => {
    let size: any;
    
    if (params.sizeId.length > 4) {
        size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        });
    } else {
    }
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <SizeForm initialData={size} />
            </div>
        </div>
    );
}

export default SizePage;