"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthenticatedClient = exports.createUnauthenticatedClient = void 0;
const http_signature_utils_1 = require("@interledger/http-signature-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
const config_1 = __importDefault(require("../config"));
const incoming_payment_1 = require("./incoming-payment");
const wallet_address_1 = require("./wallet-address");
const requests_1 = require("./requests");
const grant_1 = require("./grant");
const outgoing_payment_1 = require("./outgoing-payment");
const token_1 = require("./token");
const quote_1 = require("./quote");
const crypto_1 = require("crypto");
const error_1 = require("./error");
const openapi_1 = require("../openapi");
__exportStar(require("./error"), exports);
const parseKey = (deps, privateKey) => {
    if (privateKey instanceof crypto_1.KeyObject) {
        deps.logger.debug('Loading key from KeyObject');
        return privateKey;
    }
    if (privateKey instanceof Buffer) {
        try {
            deps.logger.debug('Loading key from Buffer');
            return (0, crypto_1.createPrivateKey)(privateKey);
        }
        catch {
            throw new Error('Key is not a valid file');
        }
    }
    const keyFilePath = path_1.default.resolve(process.cwd(), privateKey);
    if (fs_1.default.existsSync(keyFilePath)) {
        deps.logger.debug(`Loading key from file path: ${keyFilePath}`);
        return (0, http_signature_utils_1.loadKey)(keyFilePath);
    }
    try {
        deps.logger.debug('Loading key from string');
        return (0, crypto_1.createPrivateKey)(privateKey);
    }
    catch {
        throw new Error('Key is not a valid path or file');
    }
};
const createUnauthenticatedDeps = async ({ useHttp = false, validateResponses = true, ...args } = {}) => {
    const logger = args.logger ??
        (0, pino_1.default)({ name: 'Open Payments Client', level: 'silent' });
    if (args.logLevel) {
        logger.level = args.logLevel;
    }
    const httpClient = await (0, requests_1.createHttpClient)({
        logger,
        requestTimeoutMs: args.requestTimeoutMs ?? config_1.default.DEFAULT_REQUEST_TIMEOUT_MS
    });
    let walletAddressServerOpenApi;
    let resourceServerOpenApi;
    if (validateResponses) {
        walletAddressServerOpenApi = await (0, openapi_1.getWalletAddressServerOpenAPI)();
        resourceServerOpenApi = await (0, openapi_1.getResourceServerOpenAPI)();
    }
    return {
        httpClient,
        walletAddressServerOpenApi,
        resourceServerOpenApi,
        logger,
        useHttp
    };
};
const createAuthenticatedClientDeps = async ({ useHttp = false, validateResponses = true, ...args }) => {
    const logger = args.logger ??
        (0, pino_1.default)({ name: 'Open Payments Client', level: 'silent' });
    if (args.logLevel) {
        logger.level = args.logLevel;
    }
    let httpClient;
    if ('authenticatedRequestInterceptor' in args) {
        httpClient = await (0, requests_1.createHttpClient)({
            logger,
            requestTimeoutMs: args.requestTimeoutMs ?? config_1.default.DEFAULT_REQUEST_TIMEOUT_MS,
            requestSigningArgs: {
                authenticatedRequestInterceptor: args.authenticatedRequestInterceptor
            }
        });
    }
    else {
        let privateKey;
        try {
            privateKey = parseKey({ logger }, args.privateKey);
        }
        catch (error) {
            const errorMessage = 'Could not load private key when creating authenticated client';
            const description = error instanceof Error ? error.message : 'Unknown error';
            logger.error({ description }, errorMessage);
            throw new error_1.OpenPaymentsClientError(errorMessage, {
                description
            });
        }
        httpClient = await (0, requests_1.createHttpClient)({
            logger,
            requestTimeoutMs: args.requestTimeoutMs ?? config_1.default.DEFAULT_REQUEST_TIMEOUT_MS,
            requestSigningArgs: {
                privateKey,
                keyId: args.keyId
            }
        });
    }
    let walletAddressServerOpenApi;
    let resourceServerOpenApi;
    let authServerOpenApi;
    if (validateResponses) {
        walletAddressServerOpenApi = await (0, openapi_1.getWalletAddressServerOpenAPI)();
        resourceServerOpenApi = await (0, openapi_1.getResourceServerOpenAPI)();
        authServerOpenApi = await (0, openapi_1.getAuthServerOpenAPI)();
    }
    return {
        httpClient,
        walletAddressServerOpenApi,
        resourceServerOpenApi,
        authServerOpenApi,
        logger,
        useHttp
    };
};
/**
 * Creates an OpenPayments client that is only able to make requests for public fields.
 */
const createUnauthenticatedClient = async (args) => {
    const { resourceServerOpenApi, walletAddressServerOpenApi, ...baseDeps } = await createUnauthenticatedDeps(args);
    baseDeps.logger.debug({
        validateResponses: !!args.validateResponses,
        useHttp: baseDeps.useHttp,
        requestTimeoutMs: args.requestTimeoutMs ?? config_1.default.DEFAULT_REQUEST_TIMEOUT_MS
    }, 'Created unauthenticated client');
    return {
        walletAddress: (0, wallet_address_1.createWalletAddressRoutes)({
            ...baseDeps,
            openApi: walletAddressServerOpenApi
        }),
        incomingPayment: (0, incoming_payment_1.createUnauthenticatedIncomingPaymentRoutes)({
            ...baseDeps,
            openApi: resourceServerOpenApi
        })
    };
};
exports.createUnauthenticatedClient = createUnauthenticatedClient;
async function createAuthenticatedClient(args) {
    if ('authenticatedRequestInterceptor' in args &&
        ('privateKey' in args || 'keyId' in args)) {
        throw new error_1.OpenPaymentsClientError('Invalid arguments when creating authenticated client.', {
            description: 'Both `authenticatedRequestInterceptor` and `privateKey`/`keyId` were provided. Please use only one of these options.'
        });
    }
    const { resourceServerOpenApi, authServerOpenApi, walletAddressServerOpenApi, ...baseDeps } = await createAuthenticatedClientDeps(args);
    baseDeps.logger.debug({
        walletAddressUrl: args.walletAddressUrl,
        ...('keyId' in args ? { keyId: args.keyId } : {}),
        validateResponses: !!args.validateResponses,
        useHttp: baseDeps.useHttp,
        requestTimeoutMs: args.requestTimeoutMs ?? config_1.default.DEFAULT_REQUEST_TIMEOUT_MS
    }, 'Created authenticated client');
    return {
        incomingPayment: (0, incoming_payment_1.createIncomingPaymentRoutes)({
            ...baseDeps,
            openApi: resourceServerOpenApi
        }),
        outgoingPayment: (0, outgoing_payment_1.createOutgoingPaymentRoutes)({
            ...baseDeps,
            openApi: resourceServerOpenApi
        }),
        walletAddress: (0, wallet_address_1.createWalletAddressRoutes)({
            ...baseDeps,
            openApi: walletAddressServerOpenApi
        }),
        grant: (0, grant_1.createGrantRoutes)({
            ...baseDeps,
            openApi: authServerOpenApi,
            client: args.walletAddressUrl
        }),
        token: (0, token_1.createTokenRoutes)({
            ...baseDeps,
            openApi: authServerOpenApi
        }),
        quote: (0, quote_1.createQuoteRoutes)({
            ...baseDeps,
            openApi: resourceServerOpenApi
        })
    };
}
exports.createAuthenticatedClient = createAuthenticatedClient;
