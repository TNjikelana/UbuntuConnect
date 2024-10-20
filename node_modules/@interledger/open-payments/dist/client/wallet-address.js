"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletAddressRoutes = void 0;
const openapi_1 = require("@interledger/openapi");
const types_1 = require("../types");
const requests_1 = require("./requests");
const createWalletAddressRoutes = (deps) => {
    const { openApi, ...baseDeps } = deps;
    let getWalletAddressValidator;
    let getWalletAddressKeysValidator;
    let getDidDocumentValidator;
    if (openApi) {
        getWalletAddressValidator = openApi.createResponseValidator({
            path: (0, types_1.getWAPath)('/'),
            method: openapi_1.HttpMethod.GET
        });
        getWalletAddressKeysValidator = openApi.createResponseValidator({
            path: (0, types_1.getWAPath)('/jwks.json'),
            method: openapi_1.HttpMethod.GET
        });
        getDidDocumentValidator = openApi.createResponseValidator({
            path: (0, types_1.getWAPath)('/did.json'),
            method: openapi_1.HttpMethod.GET
        });
    }
    return {
        get: (args) => (0, requests_1.get)(baseDeps, args, getWalletAddressValidator),
        getKeys: (args) => (0, requests_1.get)(baseDeps, {
            url: `${args.url}/jwks.json`
        }, getWalletAddressKeysValidator),
        getDIDDocument: (args) => (0, requests_1.get)(baseDeps, {
            url: `${args.url}/did.json`
        }, getDidDocumentValidator)
    };
};
exports.createWalletAddressRoutes = createWalletAddressRoutes;
