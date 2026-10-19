import { cookies } from "next/headers"

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
        return {
            success: false,
            message: "You are not logged in"
        }
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
        method: 'GET',
        headers: {
            // Authorization: `Bearer ${accessToken.value}`
            Cookie: `accessToken=${accessToken}`
        },
        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24,
            tags: ["my-profile"]
        }
    })

    const data = await res.json();
    return data;
}