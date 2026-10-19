'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface LoginState {
    success: boolean
    message: string
    data?: {
        accessToken: string
        refreshToken: string
    }
}

export const loginAction = async (prevState: LoginState | null, formData: FormData) => {
    const email = formData.get('email')
    const password = formData.get('password')

    const payload = {
        email,
        password
    }

    const result = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })

    const data: LoginState = await result.json()
    console.log(data)

    if (data.success && data.data?.accessToken) {
        const cookieStore = await cookies()

        cookieStore.set('accessToken', data.data.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24
        })

        cookieStore.set('refreshToken', data.data.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        })

        redirect("/dashboard", "replace")
    }

    return data;

}