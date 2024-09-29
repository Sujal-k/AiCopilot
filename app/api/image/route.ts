import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@gradio/client";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount, resolution } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!prompt || typeof prompt !== "string") {
            return new NextResponse("Prompt is required and should be a string.", { status: 400 });
        }

        // Initialize Gradio client with the correct endpoint
        const app = await client("https://model.echelonify.com/");

        // Send the prediction request using Gradio client
        const result = await app.predict(70, []);
        console.log(result)
        console.log(`result.data[0].value`)

        if (result && result.data) {
            // Return the response directly without parsing
            const image = result.data;  // Assuming result.data contains the base64 image in HTML component
            return NextResponse.json({ output: [image] });
        } else {
            console.error("[IMAGE_GENERATION_ERROR] No valid response data:", result);
            return new NextResponse("Error generating image", { status: 500 });
        }
    } catch (error: any) {
        console.error("[IMAGE_GENERATION_ERROR] Error:", error.message);
        return new NextResponse(`Internal Error: ${error.message}, { status: 500 }`);
    }
}