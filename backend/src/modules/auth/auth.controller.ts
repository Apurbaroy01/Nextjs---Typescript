import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import config from "../../config";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const { accessToken, refreshToken } = await authService.loginUser(payload)

    const isProduction = config.node_env === 'production';

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken }
    })

})


const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;
    const refreshToken = await authService.refreshToken(token)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Token refreshed successfully",
        data: { refreshToken }
    })
})

export const authController = {
    loginUser,
    refreshToken,
}