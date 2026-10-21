/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken"


const verifyToken = (token: string, secret: string) => {
    try {
        const verifyedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifyedToken
        }
    } catch (error: any) {
        console.log("token verified failed", error)
        return {
            success: false,
            error: error.message
        }
    }
}

export const jwtUtils = {
    verifyToken
}