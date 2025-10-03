import { ZodError, } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.interface";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSources = err.issues.map((issue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue?.message
        }
    })

    const statusCode = 400;

    return {
        statusCode,
        message: "Validation Error",
        errorSources,
    }
}

export default handleZodError;