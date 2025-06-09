import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function GET(req: NextRequest) {
    const nonce = crypto.randomUUID().replace(/-/g, "");

    const response = NextResponse.json({ nonce });
    response.cookies.set("siwe", nonce, { secure: true });
    return response;
}
