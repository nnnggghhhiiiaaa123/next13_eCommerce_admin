import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }

) {
    try {
        console.log("11- ");

        if (!params.billboardId) {
            return new NextResponse("Billboard id id is reqired", { status: 400 })
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", { status: 500 });


    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { sizeId: string, storeId: string } }
  ) {
    try {
      const { userId } = auth();
  
      const body = await req.json();
  
      const { name, value } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }
  
      if (!value) {
        return new NextResponse("Value is required", { status: 400 });
      }
  
  
      if (!params.sizeId) {
        return new NextResponse("Size id is required", { status: 400 });
      }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId
        }
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }
  
      const size = await prismadb.size.update({
        where: {
          id: params.sizeId
        },
        data: {
          name,
          value
        }
      });
    
      return NextResponse.json(size);
    } catch (error) {
      console.log('[SIZE_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }

) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 })
        }
        if (!params.billboardId) {
            return new NextResponse("Billboard id id is reqired", { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });
        console.log("61", billboard);
        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });


    }
}