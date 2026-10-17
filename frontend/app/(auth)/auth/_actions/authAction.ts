'use server'

interface LoginState {
    success: boolean
    message: string
    data?: {
        accessToken: string
        refreshToken: string
    }
}

export const loginAction = async (prevState: LoginState, formData: FormData) => {
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

    const data = await result.json()
    console.log(data)

    return data;

}