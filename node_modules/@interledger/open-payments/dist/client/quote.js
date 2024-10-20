"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuote = exports.getQuote = exports.createQuoteRoutes = void 0;
const openapi_1 = require("@interledger/openapi");
const types_1 = require("../types");
const requests_1 = require("./requests");
const createQuoteRoutes = (deps) => {
    const { openApi, ...baseDeps } = deps;
    let getQuoteOpenApiValidator;
    let createQuoteOpenApiValidator;
    if (openApi) {
        getQuoteOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/quotes/{id}'),
            method: openapi_1.HttpMethod.GET
        });
        createQuoteOpenApiValidator = openApi.createResponseValidator({
            path: (0, types_1.getRSPath)('/quotes'),
            method: openapi_1.HttpMethod.POST
        });
    }
    return {
        get: (args) => (0, exports.getQuote)(baseDeps, args, getQuoteOpenApiValidator),
        create: (createArgs, createQuoteArgs) => (0, exports.createQuote)(baseDeps, createArgs, createQuoteOpenApiValidator, createQuoteArgs)
    };
};
exports.createQuoteRoutes = createQuoteRoutes;
const getQuote = async (deps, args, validateOpenApiResponse) => {
    const quote = await (0, requests_1.get)(deps, args, validateOpenApiResponse);
    return quote;
};
exports.getQuote = getQuote;
const createQuote = async (deps, createArgs, validateOpenApiResponse, createQuoteArgs) => {
    const { accessToken, url: baseUrl } = createArgs;
    const url = `${baseUrl}${(0, types_1.getRSPath)('/quotes')}`;
    const quote = await (0, requests_1.post)(deps, { url, accessToken, body: createQuoteArgs }, validateOpenApiResponse);
    return quote;
};
exports.createQuote = createQuote;
