'use server'

export const loginAction = async (formData: FormData) => {
    const email = formData.get('email')
    const password = formData.get('password')

    const payload = {
        email,
        password
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })

    const data = await result.json()
    console.log(data)

}