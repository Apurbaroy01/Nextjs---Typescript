import { cookies } from "next/headers"

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')

    if (!accessToken) {
        return { message: "Unauthorized" }
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
            // Authorization: `Bearer ${accessToken.value}`
            Cookie: `accessToken=${accessToken}`
        }
    })

    const data = await res.json();
    console.log(data);
}