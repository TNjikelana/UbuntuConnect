"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeToken = exports.rotateToken = exports.createTokenRoutes = void 0;
const openapi_1 = require("@interledger/openapi");
const types_1 = require("../types");
const requests_1 = require("./requests");
const createTokenRoutes = (deps) => {
    const { openApi, ...baseDeps } = deps;
    let rotateTokenValidator;
    let revokeTokenValidator;
    if (openApi) {
        rotateTokenValidator = openApi.createResponseValidator({
            path: (0, types_1.getASPath)('/token/{id}'),
            method: openapi_1.HttpMethod.POST
        });
        revokeTokenValidator = openApi.createResponseValidator({
            path: (0, types_1.getASPath)('/token/{id}'),
            method: openapi_1.HttpMethod.DELETE
        });
    }
    return {
        rotate: (args) => (0, exports.rotateToken)(baseDeps, args, rotateTokenValidator),
        revoke: (args) => (0, exports.revokeToken)(baseDeps, args, revokeTokenValidator)
    };
};
exports.createTokenRoutes = createTokenRoutes;
const rotateToken = async (deps, args, validateOpenApiResponse) => {
    const { url, accessToken } = args;
    return (0, requests_1.post)(deps, {
        url,
        accessToken
    }, validateOpenApiResponse);
};
exports.rotateToken = rotateToken;
const revokeToken = async (deps, args, validateOpenApiResponse) => {
    const { url, accessToken } = args;
    return (0, requests_1.deleteRequest)(deps, {
        url,
        accessToken
    }, validateOpenApiResponse);
};
exports.revokeToken = revokeToken;
