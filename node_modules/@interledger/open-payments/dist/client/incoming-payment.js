"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCompletedIncomingPayment = exports.validateCreatedIncomingPayment = exports.validateIncomingPayment = exports.listIncomingPayment = exports.completeIncomingPayment = exports.createIncomingPayment = exports.getPublicIncomingPayment = exports.getIncomingPayment = exports.createUnauthenticatedIncomingPaymentRoutes = exports.createIncomingPaymentRoutes = void 0;
const openapi_1 = require("@interledger/openapi");
const types_1 = require("../types");
const requests_1 = require("./requests");
const validation_error_1 = require("./validation-error");
const createIncomingPaymentRoutes = (deps) => {
    const { openApi, ...baseDeps } = deps;
    let getIncomingPaymentOpenApiValidator;
    let getPublicIncomingPaymentOpenApiValidator;
    let createIncomingPaymentOpenApiValidator;
    let completeIncomingPaymentOpenApiValidator;
    let listIncomingPaymentOpenApiValidator;
    if (openApi) {
        getIncomingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/incoming-payments/{id}'),
            method: openapi_1.HttpMethod.GET
        });
        getPublicIncomingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/incoming-payments/{id}'),
            method: openapi_1.HttpMethod.GET
        });
        createIncomingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/incoming-payments'),
            method: openapi_1.HttpMethod.POST
        });
        completeIncomingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/incoming-payments/{id}/complete'),
            method: openapi_1.HttpMethod.POST
        });
        listIncomingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/incoming-payments'),
            method: openapi_1.HttpMethod.GET
        });
    }
    return {
        get: (args) => (0, exports.getIncomingPayment)(baseDeps, args, getIncomingPaymentOpenApiValidator),
        getPublic: (args) => (0, exports.getPublicIncomingPayment)(baseDeps, args, getPublicIncomingPaymentOpenApiValidator),
        create: (requestArgs, createArgs) => (0, exports.createIncomingPayment)(baseDeps, requestArgs, createArgs, createIncomingPaymentOpenApiValidator),
        complete: (args) => (0, exports.completeIncomingPayment)(baseDeps, args, completeIncomingPaymentOpenApiValidator),
        list: (args, pagination) => (0, exports.listIncomingPayment)(baseDeps, args, listIncomingPaymentOpenApiValidator, pagination)
    };
};
exports.createIncomingPaymentRoutes = createIncomingPaymentRoutes;
const createUnauthenticatedIncomingPaymentRoutes = (deps) => {
    const { openApi, ...baseDeps } = deps;
    let getPublicIncomingPaymentOpenApiValidator;
    if (openApi) {
        getPublicIncomingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/incoming-payments/{id}'),
            method: openapi_1.HttpMethod.GET
        });
    }
    return {
        get: (args) => (0, exports.getPublicIncomingPayment)(baseDeps, args, getPublicIncomingPaymentOpenApiValidator)
    };
};
exports.createUnauthenticatedIncomingPaymentRoutes = createUnauthenticatedIncomingPaymentRoutes;
const getIncomingPayment = async (deps, args, validateOpenApiResponse) => {
    const { url } = args;
    const incomingPayment = await (0, requests_1.get)(deps, {
        ...args
    }, validateOpenApiResponse);
    try {
        return (0, exports.validateIncomingPayment)(incomingPayment);
    }
    catch (error) {
        return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not validate incoming payment');
    }
};
exports.getIncomingPayment = getIncomingPayment;
const getPublicIncomingPayment = async (deps, args, validateOpenApiResponse) => {
    return await (0, requests_1.get)(deps, args, validateOpenApiResponse);
};
exports.getPublicIncomingPayment = getPublicIncomingPayment;
const createIncomingPayment = async (deps, requestArgs, createArgs, validateOpenApiResponse) => {
    const { url: baseUrl, accessToken } = requestArgs;
    const url = `${baseUrl}${(0, types_1.getRSPath)('/incoming-payments')}`;
    const incomingPayment = await (0, requests_1.post)(deps, { url, accessToken, body: createArgs }, validateOpenApiResponse);
    try {
        return (0, exports.validateCreatedIncomingPayment)(incomingPayment);
    }
    catch (error) {
        return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not create incoming payment');
    }
};
exports.createIncomingPayment = createIncomingPayment;
const completeIncomingPayment = async (deps, args, validateOpenApiResponse) => {
    const { url: incomingPaymentUrl, accessToken } = args;
    const url = `${incomingPaymentUrl}/complete`;
    const incomingPayment = await (0, requests_1.post)(deps, { url, accessToken }, validateOpenApiResponse);
    try {
        return (0, exports.validateCompletedIncomingPayment)(incomingPayment);
    }
    catch (error) {
        return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not complete incoming payment');
    }
};
exports.completeIncomingPayment = completeIncomingPayment;
const listIncomingPayment = async (deps, args, validateOpenApiResponse, pagination) => {
    const { url: baseUrl, accessToken, walletAddress } = args;
    const url = `${baseUrl}${(0, types_1.getRSPath)('/incoming-payments')}`;
    const incomingPayments = await (0, requests_1.get)(deps, {
        url,
        accessToken,
        ...(pagination
            ? { queryParams: { ...pagination, 'wallet-address': walletAddress } }
            : { queryParams: { 'wallet-address': walletAddress } })
    }, validateOpenApiResponse);
    for (const incomingPayment of incomingPayments.result) {
        try {
            (0, exports.validateIncomingPayment)(incomingPayment);
        }
        catch (error) {
            return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not validate an incoming payment');
        }
    }
    return incomingPayments;
};
exports.listIncomingPayment = listIncomingPayment;
const validateIncomingPayment = (payment) => {
    if (payment.incomingAmount) {
        const { incomingAmount, receivedAmount } = payment;
        if (incomingAmount.assetCode !== receivedAmount.assetCode ||
            incomingAmount.assetScale !== receivedAmount.assetScale) {
            throw new Error('Incoming amount asset code or asset scale does not match up received amount');
        }
    }
    return payment;
};
exports.validateIncomingPayment = validateIncomingPayment;
const validateCreatedIncomingPayment = (payment) => {
    const { receivedAmount, completed } = payment;
    if (BigInt(receivedAmount.value) !== BigInt(0)) {
        throw new Error('Received amount is a non-zero value');
    }
    if (completed) {
        throw new Error('Can not create a completed incoming payment');
    }
    return (0, exports.validateIncomingPayment)(payment);
};
exports.validateCreatedIncomingPayment = validateCreatedIncomingPayment;
const validateCompletedIncomingPayment = (payment) => {
    const { completed } = payment;
    if (!completed) {
        throw new Error('Incoming payment could not be completed');
    }
    return (0, exports.validateIncomingPayment)(payment);
};
exports.validateCompletedIncomingPayment = validateCompletedIncomingPayment;
