/// <reference types="node" />
/// <reference types="node" />
import { KeyObject } from 'crypto';
import { ResponseValidator } from '@interledger/openapi';
import { BaseDeps } from '.';
import { Logger } from 'pino';
import type { KyInstance } from 'ky';
interface GetArgs {
    url: string;
    queryParams?: Record<string, string | number | undefined>;
    accessToken?: string;
}
interface PostArgs<T = undefined> {
    url: string;
    body?: T;
    accessToken?: string;
}
interface DeleteArgs {
    url: string;
    accessToken?: string;
}
export declare const get: <T>(deps: BaseDeps, args: GetArgs, openApiResponseValidator?: ResponseValidator<T> | undefined) => Promise<T>;
export declare const post: <TRequest, TResponse>(deps: BaseDeps, args: PostArgs<TRequest>, openApiResponseValidator?: ResponseValidator<TResponse> | undefined) => Promise<TResponse>;
export declare const deleteRequest: <TResponse>(deps: BaseDeps, args: DeleteArgs, openApiResponseValidator?: ResponseValidator<TResponse> | undefined) => Promise<void>;
interface HandleErrorArgs {
    error: unknown;
    url: string;
    requestType: 'POST' | 'DELETE' | 'GET';
}
export declare const handleError: (deps: BaseDeps, args: HandleErrorArgs) => Promise<never>;
interface CreateHttpClientArgs {
    logger: Logger;
    requestTimeoutMs: number;
    requestSigningArgs?: AuthenticatedHttpClientArgs;
}
type AuthenticatedHttpClientArgs = {
    privateKey: KeyObject;
    keyId: string;
} | {
    authenticatedRequestInterceptor: InterceptorFn;
};
export type HttpClient = KyInstance;
export type InterceptorFn = (request: Request) => Request | Promise<Request> | void | Promise<void>;
export declare const createHttpClient: (args: CreateHttpClientArgs) => Promise<HttpClient>;
export declare const requestShouldBeAuthorized: (request: Request) => boolean;
export declare const signRequest: (request: Request, args: {
    privateKey?: KeyObject;
    keyId?: string;
}) => Promise<Request>;
export {};
