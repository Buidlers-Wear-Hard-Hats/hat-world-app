import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Mock implementation - replace with actual DB call
async function getUserById(userId: string) {
    console.log(`Getting user with ID: ${userId}`);

    return {
        id: userId,
        walletAddress: null,
        username: null,
        profilePictureUrl: null,
        isNewUser: false
    };
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token');
        
        if (!token) {
            return NextResponse.json({ 
                authenticated: false,
                message: 'Not authenticated' 
            }, { status: 401 });
        }
        
        const { payload } = await jwtVerify(
            token.value,
            new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_replace_in_production')
        );
        
        if (!payload.userId) {
            return NextResponse.json({ 
                authenticated: false,
                message: 'Invalid token' 
            }, { status: 401 });
        }

        const user = await getUserById(payload.userId as string);
        
        return NextResponse.json({
            authenticated: true,
            user: user
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ 
            authenticated: false,
            message: 'Authentication error' 
        }, { status: 401 });
    }
}
