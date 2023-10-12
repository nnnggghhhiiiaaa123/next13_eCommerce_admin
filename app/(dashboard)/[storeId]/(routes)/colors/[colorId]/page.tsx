import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";
import { useEffect } from "react";

const ColorPage = async ({
    params
}: {
    params: { colorId: string }
}) => {
    let color: any;
    
    if (params.colorId.length > 4) {
        color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });
    } else {
    }
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <ColorForm initialData={color} />
            </div>
        </div>
    );
}

export default ColorPage;