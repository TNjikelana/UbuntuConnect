"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRequest = exports.requestShouldBeAuthorized = exports.createHttpClient = exports.handleError = exports.deleteRequest = exports.post = exports.get = void 0;
const openapi_1 = require("@interledger/openapi");
const http_signature_utils_1 = require("@interledger/http-signature-utils");
const error_1 = require("./error");
const get = async (deps, args, openApiResponseValidator) => {
    const { httpClient } = deps;
    const { accessToken } = args;
    const urlWithUpdatedProtocol = checkUrlProtocol(deps, args.url);
    const url = getUrlWithQueryParams(urlWithUpdatedProtocol, args.queryParams);
    try {
        const response = await httpClient.get(url, {
            headers: accessToken
                ? {
                    Authorization: `GNAP ${accessToken}`
                }
                : {}
        });
        const responseBody = await response.json();
        if (openApiResponseValidator) {
            openApiResponseValidator({
                status: response.status,
                body: responseBody
            });
        }
        return responseBody;
    }
    catch (error) {
        return (0, exports.handleError)(deps, { url, error, requestType: 'GET' });
    }
};
exports.get = get;
const getUrlWithQueryParams = (url, queryParams) => {
    if (!queryParams) {
        return url;
    }
    const urlObject = new URL(url);
    for (const [key, value] of Object.entries(queryParams)) {
        if (value) {
            urlObject.searchParams.set(key, value.toString());
        }
    }
    return urlObject.href;
};
const post = async (deps, args, openApiResponseValidator) => {
    const { httpClient } = deps;
    const { body, accessToken } = args;
    const url = checkUrlProtocol(deps, args.url);
    try {
        const response = await httpClient.post(url, {
            json: body,
            headers: accessToken
                ? {
                    Authorization: `GNAP ${accessToken}`
                }
                : {}
        });
        const responseBody = await response.json();
        if (openApiResponseValidator) {
            openApiResponseValidator({
                status: response.status,
                body: responseBody
            });
        }
        return responseBody;
    }
    catch (error) {
        return (0, exports.handleError)(deps, { url, error, requestType: 'POST' });
    }
};
exports.post = post;
const deleteRequest = async (deps, args, openApiResponseValidator) => {
    const { httpClient } = deps;
    const { accessToken } = args;
    const url = checkUrlProtocol(deps, args.url);
    try {
        const response = await httpClient.delete(url, {
            headers: accessToken
                ? {
                    Authorization: `GNAP ${accessToken}`
                }
                : {}
        });
        if (openApiResponseValidator) {
            openApiResponseValidator({
                status: response.status,
                body: undefined
            });
        }
    }
    catch (error) {
        return (0, exports.handleError)(deps, { url, error, requestType: 'DELETE' });
    }
};
exports.deleteRequest = deleteRequest;
const handleError = async (deps, args) => {
    const { error, url, requestType } = args;
    let errorDescription;
    let errorStatus;
    let validationErrors;
    let errorCode;
    const { HTTPError } = await import('ky');
    if (error instanceof HTTPError) {
        let responseBody;
        try {
            responseBody = await error.response.text();
            responseBody = JSON.parse(responseBody);
        }
        catch {
            // Ignore if we can't parse the response body (or no body exists)
        }
        errorStatus = error.response.status;
        errorDescription =
            typeof responseBody === 'object'
                ? responseBody.error?.description || JSON.stringify(responseBody)
                : responseBody || error.message;
        errorCode =
            typeof responseBody === 'object' ? responseBody.error?.code : undefined;
    }
    else if ((0, openapi_1.isValidationError)(error)) {
        errorDescription = 'Could not validate OpenAPI response';
        validationErrors = error.errors.map((e) => e.message);
        errorStatus = error.status;
    }
    else if (error instanceof Error) {
        errorDescription = error.message;
    }
    else {
        errorDescription = 'Received unexpected error';
        deps.logger.error({ err: error });
    }
    const errorMessage = `Error making Open Payments ${requestType} request`;
    deps.logger.error({
        method: requestType,
        url,
        status: errorStatus,
        description: errorDescription,
        code: errorCode
    }, errorMessage);
    throw new error_1.OpenPaymentsClientError(errorMessage, {
        description: errorDescription,
        validationErrors,
        status: errorStatus,
        code: errorCode
    });
};
exports.handleError = handleError;
const checkUrlProtocol = (deps, url) => {
    const requestUrl = new URL(url);
    if (deps.useHttp) {
        requestUrl.protocol = 'http';
    }
    return requestUrl.href;
};
const createHttpClient = async (args) => {
    const { default: ky } = await import('ky');
    const { requestTimeoutMs, requestSigningArgs, logger } = args;
    const kyInstance = ky.create({
        timeout: requestTimeoutMs,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const beforeRequestHooks = [];
    const afterResponseHooks = [];
    const requestLogger = async (request) => {
        const requestBody = request.body ? await request.clone().json() : undefined;
        logger.debug({
            method: request.method,
            url: request.url,
            body: requestBody
        }, 'Sending request');
    };
    const responseLogger = async (request, _, response) => {
        let responseBody;
        try {
            responseBody = await response.clone().text();
            responseBody = JSON.parse(responseBody);
        }
        catch {
            // Ignore if we can't parse the response body (or no body exists)
        }
        logger.debug({
            method: request.method,
            url: response.url,
            body: responseBody,
            status: response.status
        }, 'Received response');
    };
    beforeRequestHooks.push(requestLogger);
    afterResponseHooks.push(responseLogger);
    if (requestSigningArgs) {
        let requestInterceptor;
        if ('authenticatedRequestInterceptor' in requestSigningArgs) {
            requestInterceptor = (request) => {
                if ((0, exports.requestShouldBeAuthorized)(request)) {
                    return requestSigningArgs.authenticatedRequestInterceptor(request);
                }
                return request;
            };
        }
        else {
            requestInterceptor = (request) => {
                const { privateKey, keyId } = requestSigningArgs;
                if ((0, exports.requestShouldBeAuthorized)(request)) {
                    return (0, exports.signRequest)(request, { privateKey, keyId });
                }
                return request;
            };
        }
        beforeRequestHooks.push(requestInterceptor);
    }
    return kyInstance.extend({
        hooks: {
            beforeRequest: beforeRequestHooks,
            afterResponse: afterResponseHooks
        }
    });
};
exports.createHttpClient = createHttpClient;
const requestShouldBeAuthorized = (request) => request.method?.toLowerCase() === 'post' ||
    request.headers.has('Authorization');
exports.requestShouldBeAuthorized = requestShouldBeAuthorized;
const signRequest = async (request, args) => {
    const { privateKey, keyId } = args;
    if (!privateKey || !keyId) {
        return request;
    }
    const requestBody = request.body ? await request.clone().json() : undefined; // Request body can only ever be read once, so we clone the original request
    const contentAndSigHeaders = await (0, http_signature_utils_1.createHeaders)({
        request: {
            method: request.method.toUpperCase(),
            url: request.url,
            headers: Object.fromEntries(request.headers.entries()),
            body: requestBody ? JSON.stringify(requestBody) : undefined
        },
        privateKey,
        keyId
    });
    if (requestBody) {
        request.headers.set('Content-Digest', contentAndSigHeaders['Content-Digest']);
        request.headers.set('Content-Length', contentAndSigHeaders['Content-Length']);
        request.headers.set('Content-Type', contentAndSigHeaders['Content-Type']);
    }
    request.headers.set('Signature', contentAndSigHeaders['Signature']);
    request.headers.set('Signature-Input', contentAndSigHeaders['Signature-Input']);
    return request;
};
exports.signRequest = signRequest;
