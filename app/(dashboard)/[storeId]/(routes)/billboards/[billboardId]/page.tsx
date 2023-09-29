import prismadb from "@/lib/prismadb";
import { BillboardsForm } from "./components/billboard-form";
import { useEffect } from "react";

const BillboardPage = async ({
    params
}: {
    params: { billboardId: string }
}) => {
    let billboard: any;
    
    if (params.billboardId.length > 4) {
        billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        });
    } else {
    }
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <BillboardsForm initialData={billboard} />
            </div>
        </div>
    );
}

export default BillboardPage;