"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
import toast from "react-hot-toast";
import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";

import ImageUpload from "@/components/ui/image-upload";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormLabel, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});
type BillboardsFormValues = z.infer<typeof formSchema>

interface BillboardsFormProps {
    initialData: Billboard | null;
}

export const BillboardsForm: React.FC<BillboardsFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit billboard" : "Create billboard";
    const description = initialData ? "Edit a billboard" : "Create billboard";
    const toastMessage = initialData ? "Billboard updated" : "Billboard created";
    const action = initialData ? "Save changes" : "Created";


    const form = useForm<BillboardsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: BillboardsFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);

            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);

            }
            router.refresh()
            toast.success(toastMessage);

        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true);
            console.log("axios", params.storeId);
            var res = await axios.delete(`/api/${params.storeId}/billboard/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard deleted.")
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.");
        } finally {
            setLoading(false);
            setOpen(false)

        }
    }
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)
                }
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />

                {initialData && (<Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={
                        () => setOpen(true)
                    }>
                    <Trash className="h-4 w-4" />
                </Button>)
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Background image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )} />

                    </div>
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard label" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />


        </>
    );
}