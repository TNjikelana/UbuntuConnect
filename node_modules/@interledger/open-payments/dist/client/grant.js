"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrantRoutes = void 0;
const openapi_1 = require("@interledger/openapi");
const types_1 = require("../types");
const requests_1 = require("./requests");
const createGrantRoutes = (deps) => {
    const { openApi, client, ...baseDeps } = deps;
    let requestGrantValidator;
    let continueGrantValidator;
    let cancelGrantValidator;
    if (openApi) {
        requestGrantValidator = openApi.createResponseValidator({
            path: (0, types_1.getASPath)('/'),
            method: openapi_1.HttpMethod.POST
        });
        continueGrantValidator = openApi.createResponseValidator({
            path: (0, types_1.getASPath)('/continue/{id}'),
            method: openapi_1.HttpMethod.POST
        });
        cancelGrantValidator = openApi.createResponseValidator({
            path: (0, types_1.getASPath)('/continue/{id}'),
            method: openapi_1.HttpMethod.DELETE
        });
    }
    return {
        request: ({ url }, args) => (0, requests_1.post)(baseDeps, {
            url,
            body: {
                ...args,
                client
            }
        }, requestGrantValidator),
        continue: ({ url, accessToken }, args) => (0, requests_1.post)(baseDeps, {
            url,
            accessToken,
            body: args
        }, continueGrantValidator),
        cancel: ({ url, accessToken }) => (0, requests_1.deleteRequest)(baseDeps, {
            url,
            accessToken
        }, cancelGrantValidator)
    };
};
exports.createGrantRoutes = createGrantRoutes;
