"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthServerOpenAPI = exports.getWalletAddressServerOpenAPI = exports.getResourceServerOpenAPI = void 0;
const openapi_1 = require("@interledger/openapi");
const path_1 = __importDefault(require("path"));
/**
 * Returns the OpenAPI object for the Open Payments Resource Server OpenAPI spec.
 * This object allows validating requests and responses against the spec.
 * See more: https://github.com/interledger/open-payments/blob/main/packages/openapi/README.md
 */
async function getResourceServerOpenAPI() {
    return (0, openapi_1.createOpenAPI)(path_1.default.resolve(__dirname, './specs/resource-server.yaml'));
}
exports.getResourceServerOpenAPI = getResourceServerOpenAPI;
/**
 * Returns the OpenAPI object for the Open Payments Wallet Address Server OpenAPI spec.
 * This object allows validating requests and responses against the spec.
 * See more: https://github.com/interledger/open-payments/blob/main/packages/openapi/README.md
 */
async function getWalletAddressServerOpenAPI() {
    return (0, openapi_1.createOpenAPI)(path_1.default.resolve(__dirname, './specs/wallet-address-server.yaml'));
}
exports.getWalletAddressServerOpenAPI = getWalletAddressServerOpenAPI;
/**
 * Returns the OpenAPI object for the Open Payments Auth Server OpenAPI spec.
 * This object allows validating requests and responses against the spec.
 * See more: https://github.com/interledger/open-payments/blob/main/packages/openapi/README.md
 */
async function getAuthServerOpenAPI() {
    return (0, openapi_1.createOpenAPI)(path_1.default.resolve(__dirname, './specs/auth-server.yaml'));
}
exports.getAuthServerOpenAPI = getAuthServerOpenAPI;
