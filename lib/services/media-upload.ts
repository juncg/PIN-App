import { createClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.6,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Error compressing image:", error);
        return file;
    }
}

export async function uploadImage(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
        .from("Images")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });
    if (uploadError) {
        console.error("Upload error:", uploadError.message);
        return null;
    }
    const { data } = supabase.storage.from("Images").getPublicUrl(fileName);
    return data.publicUrl || null;
}
