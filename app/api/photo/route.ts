import { head } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const blobUrl = searchParams.get("url")

  if (!blobUrl) {
    return new NextResponse("Missing url", { status: 400 })
  }

  try {
    // Fetch the private blob server-side (token auth happens automatically)
    const res = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`)

    const contentType = res.headers.get("content-type") ?? "image/jpeg"
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=86400",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[photo]", message)
    return new NextResponse("Not found", { status: 404 })
  }
}
