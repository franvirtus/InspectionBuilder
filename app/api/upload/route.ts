import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file") as File | null

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 })
    }

    const blob = await put(`findings/${Date.now()}-${file.name}`, file, {
      access: "private",
    })

    // Return the blob URL — served through /api/photo proxy
    const proxyUrl = `/api/photo?url=${encodeURIComponent(blob.url)}`
    return NextResponse.json({ url: proxyUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[upload]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
