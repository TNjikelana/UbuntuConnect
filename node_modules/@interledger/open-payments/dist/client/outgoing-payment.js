"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOutgoingPayment = exports.listOutgoingPayments = exports.createOutgoingPayment = exports.getOutgoingPayment = exports.createOutgoingPaymentRoutes = void 0;
const openapi_1 = require("@interledger/openapi");
const types_1 = require("../types");
const requests_1 = require("./requests");
const validation_error_1 = require("./validation-error");
const createOutgoingPaymentRoutes = (deps) => {
    const { openApi, ...baseDeps } = deps;
    let getOutgoingPaymentOpenApiValidator;
    let listOutgoingPaymentOpenApiValidator;
    let createOutgoingPaymentOpenApiValidator;
    if (openApi) {
        getOutgoingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/outgoing-payments/{id}'),
            method: openapi_1.HttpMethod.GET
        });
        listOutgoingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/outgoing-payments'),
            method: openapi_1.HttpMethod.GET
        });
        createOutgoingPaymentOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/outgoing-payments'),
            method: openapi_1.HttpMethod.POST
        });
    }
    return {
        get: (requestArgs) => (0, exports.getOutgoingPayment)(baseDeps, requestArgs, getOutgoingPaymentOpenApiValidator),
        list: (requestArgs, pagination) => (0, exports.listOutgoingPayments)(baseDeps, requestArgs, listOutgoingPaymentOpenApiValidator, pagination),
        create: (requestArgs, createArgs) => (0, exports.createOutgoingPayment)(baseDeps, requestArgs, createOutgoingPaymentOpenApiValidator, createArgs)
    };
};
exports.createOutgoingPaymentRoutes = createOutgoingPaymentRoutes;
const getOutgoingPayment = async (deps, requestArgs, validateOpenApiResponse) => {
    const { url, accessToken } = requestArgs;
    const outgoingPayment = await (0, requests_1.get)(deps, {
        url,
        accessToken
    }, validateOpenApiResponse);
    try {
        return (0, exports.validateOutgoingPayment)(outgoingPayment);
    }
    catch (error) {
        return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not validate outgoing payment');
    }
};
exports.getOutgoingPayment = getOutgoingPayment;
const createOutgoingPayment = async (deps, requestArgs, validateOpenApiResponse, createArgs) => {
    const { url: baseUrl, accessToken } = requestArgs;
    const url = `${baseUrl}${(0, types_1.getRSPath)('/outgoing-payments')}`;
    const outgoingPayment = await (0, requests_1.post)(deps, { url, body: createArgs, accessToken }, validateOpenApiResponse);
    try {
        return (0, exports.validateOutgoingPayment)(outgoingPayment);
    }
    catch (error) {
        return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not create outgoing payment');
    }
};
exports.createOutgoingPayment = createOutgoingPayment;
const listOutgoingPayments = async (deps, requestArgs, validateOpenApiResponse, pagination) => {
    const { url: baseUrl, accessToken, walletAddress } = requestArgs;
    const url = `${baseUrl}${(0, types_1.getRSPath)('/outgoing-payments')}`;
    const outgoingPayments = await (0, requests_1.get)(deps, {
        url,
        accessToken,
        ...(pagination
            ? { queryParams: { ...pagination, 'wallet-address': walletAddress } }
            : { queryParams: { 'wallet-address': walletAddress } })
    }, validateOpenApiResponse);
    for (const outgoingPayment of outgoingPayments.result) {
        try {
            (0, exports.validateOutgoingPayment)(outgoingPayment);
        }
        catch (error) {
            return (0, validation_error_1.handleValidationError)(deps, error, url, 'Could not validate an outgoing payment');
        }
    }
    return outgoingPayments;
};
exports.listOutgoingPayments = listOutgoingPayments;
const validateOutgoingPayment = (payment) => {
    const { debitAmount, sentAmount } = payment;
    if (debitAmount.assetCode !== sentAmount.assetCode ||
        debitAmount.assetScale !== sentAmount.assetScale) {
        throw new Error('Asset code or asset scale of sending amount does not match sent amount');
    }
    if (BigInt(debitAmount.value) < BigInt(sentAmount.value)) {
        throw new Error('Amount sent is larger than maximum amount to send');
    }
    if (debitAmount.value === sentAmount.value && payment.failed) {
        throw new Error('Amount to send matches sent amount but payment failed');
    }
    return payment;
};
exports.validateOutgoingPayment = validateOutgoingPayment;
