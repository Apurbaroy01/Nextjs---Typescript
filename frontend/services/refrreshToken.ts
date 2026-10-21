import { cookies } from "next/headers"

export const getNewRefreshToken = async () => {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
        return {
            success: false,
            message: "No refresh token found"
        }
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
            // Authorization: `Bearer ${accessToken.value}`
            Cookie: `refreshToken=${refreshToken}`
        },
        cache: "no-cache", 
    })

    const data = await res.json();
    return data;
}