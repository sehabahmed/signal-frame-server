export type TErrorSources = {
    path: string | number | symbol;
    message: string;
}[] | undefined;

export type TGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorSources?: TErrorSources;
}