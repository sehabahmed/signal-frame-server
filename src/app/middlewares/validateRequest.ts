import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync";
import { ZodObject } from 'zod';


export const validateRequest = (schema: ZodObject) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = await schema.parseAsync({
            body: req.body,
        })

        req.body = parsedBody.body;

        next();
    })
}