"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestDeps = exports.mockQuote = exports.mockAccessToken = exports.mockContinuationRequest = exports.mockGrantRequest = exports.mockGrant = exports.mockPendingGrant = exports.mockOutgoingPaymentPaginationResult = exports.mockOutgoingPaymentWithSpentAmounts = exports.mockOutgoingPayment = exports.mockIncomingPaymentPaginationResult = exports.mockIlpPaymentMethod = exports.mockPublicIncomingPayment = exports.mockIncomingPaymentWithPaymentMethods = exports.mockIncomingPayment = exports.mockWalletAddress = exports.mockDIDDocument = exports.mockJwk = exports.mockOpenApiResponseValidators = exports.getDefaultHttpClient = exports.keyId = exports.silentLogger = void 0;
const crypto_1 = require("crypto");
const pino_1 = __importDefault(require("pino"));
const requests_1 = require("../client/requests");
const uuid_1 = require("uuid");
const base64url_1 = __importDefault(require("base64url"));
exports.silentLogger = (0, pino_1.default)({
    level: 'silent'
});
exports.keyId = 'default-key-id';
const getDefaultHttpClient = async () => (0, requests_1.createHttpClient)({
    logger: exports.silentLogger,
    requestTimeoutMs: 1000,
    requestSigningArgs: {
        keyId: exports.keyId,
        privateKey: (0, crypto_1.generateKeyPairSync)('ed25519').privateKey
    }
});
exports.getDefaultHttpClient = getDefaultHttpClient;
const mockOpenApiResponseValidators = () => ({
    successfulValidator: ((data) => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    true),
    failedValidator: ((data) => {
        const err = {
            errors: [{ message: 'Failed to validate response' }]
        };
        throw err;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })
});
exports.mockOpenApiResponseValidators = mockOpenApiResponseValidators;
const mockJwk = (overrides) => ({
    x: (0, uuid_1.v4)(),
    kid: (0, uuid_1.v4)(),
    alg: 'EdDSA',
    kty: 'OKP',
    crv: 'Ed25519',
    ...overrides
});
exports.mockJwk = mockJwk;
const mockDIDDocument = (overrides) => ({
    // TODO - Flesh this out when we have a more detailed DID Document spec
    ...overrides
});
exports.mockDIDDocument = mockDIDDocument;
const mockWalletAddress = (overrides) => ({
    id: 'https://example.com/.well-known/pay',
    authServer: 'https://auth.wallet.example/authorize',
    resourceServer: 'https://wallet.example/op',
    assetScale: 2,
    assetCode: 'USD',
    ...overrides
});
exports.mockWalletAddress = mockWalletAddress;
const mockIncomingPayment = (overrides) => ({
    id: `https://example.com/.well-known/pay/incoming-payments/${(0, uuid_1.v4)()}`,
    walletAddress: 'https://example.com/.well-known/pay',
    completed: false,
    incomingAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '10'
    },
    receivedAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '0'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
});
exports.mockIncomingPayment = mockIncomingPayment;
const mockIncomingPaymentWithPaymentMethods = (overrides) => ({
    id: `https://example.com/.well-known/pay/incoming-payments/${(0, uuid_1.v4)()}`,
    walletAddress: 'https://example.com/.well-known/pay',
    completed: false,
    incomingAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '10'
    },
    receivedAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '0'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    methods: [(0, exports.mockIlpPaymentMethod)()],
    ...overrides
});
exports.mockIncomingPaymentWithPaymentMethods = mockIncomingPaymentWithPaymentMethods;
const mockPublicIncomingPayment = (overrides) => ({
    receivedAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '0'
    },
    authServer: 'https://auth.wallet.example/authorize',
    ...overrides
});
exports.mockPublicIncomingPayment = mockPublicIncomingPayment;
const mockIlpPaymentMethod = (overrides) => ({
    type: 'ilp',
    sharedSecret: (0, base64url_1.default)('sharedSecret'),
    ilpAddress: 'test.ilpAddress',
    ...overrides
});
exports.mockIlpPaymentMethod = mockIlpPaymentMethod;
const mockIncomingPaymentPaginationResult = (overrides) => {
    const result = overrides?.result || [
        (0, exports.mockIncomingPayment)(),
        (0, exports.mockIncomingPayment)(),
        (0, exports.mockIncomingPayment)()
    ];
    return {
        result,
        pagination: overrides?.pagination || {
            startCursor: result[0].id,
            hasNextPage: true,
            hasPreviousPage: true,
            endCursor: result[result.length - 1].id
        }
    };
};
exports.mockIncomingPaymentPaginationResult = mockIncomingPaymentPaginationResult;
const mockOutgoingPayment = (overrides) => ({
    id: `https://example.com/.well-known/pay/outgoing-payments/${(0, uuid_1.v4)()}`,
    walletAddress: 'https://example.com/.well-known/pay',
    failed: false,
    debitAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '10'
    },
    sentAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '0'
    },
    receiveAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '10'
    },
    quoteId: (0, uuid_1.v4)(),
    receiver: (0, uuid_1.v4)(),
    metadata: { externalRef: 'INV #1', description: 'some description' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
});
exports.mockOutgoingPayment = mockOutgoingPayment;
const mockOutgoingPaymentWithSpentAmounts = (overrides) => ({
    ...(0, exports.mockOutgoingPayment)(),
    grantSpentDebitAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '10'
    },
    grantSpentReceiveAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '10'
    },
    ...overrides
});
exports.mockOutgoingPaymentWithSpentAmounts = mockOutgoingPaymentWithSpentAmounts;
const mockOutgoingPaymentPaginationResult = (overrides) => {
    const result = overrides?.result || [
        (0, exports.mockOutgoingPayment)(),
        (0, exports.mockOutgoingPayment)(),
        (0, exports.mockOutgoingPayment)()
    ];
    return {
        result,
        pagination: overrides?.pagination || {
            startCursor: result[0].id,
            hasNextPage: true,
            hasPreviousPage: true,
            endCursor: result[result.length - 1].id
        }
    };
};
exports.mockOutgoingPaymentPaginationResult = mockOutgoingPaymentPaginationResult;
const mockPendingGrant = (overrides) => ({
    interact: {
        redirect: 'http://example.com/redirect',
        finish: 'EF5C2D8DF0663FD5'
    },
    continue: {
        access_token: {
            value: 'BBBDD7BDD6CB8659'
        },
        uri: 'http://example.com/continue',
        wait: 5
    },
    ...overrides
});
exports.mockPendingGrant = mockPendingGrant;
const mockGrant = (overrides) => ({
    access_token: {
        value: '99C36C2A4DB5BEBC',
        manage: 'http://example.com/token/',
        access: [
            {
                type: 'incoming-payment',
                actions: ['create', 'read', 'list', 'complete']
            }
        ],
        expires_in: 600
    },
    continue: {
        access_token: {
            value: 'DECCCF3D2229DB48'
        },
        uri: 'http://example.com/continue/'
    },
    ...overrides
});
exports.mockGrant = mockGrant;
const mockGrantRequest = (overrides) => ({
    access_token: {
        access: [
            {
                type: 'quote',
                actions: ['create', 'read']
            }
        ]
    },
    client: 'https://shoe-shop/.well-known/pay',
    interact: {
        start: ['redirect'],
        finish: {
            method: 'redirect',
            uri: 'http://localhost:3030/mock-idp/fake-client',
            nonce: '456'
        }
    },
    ...overrides
});
exports.mockGrantRequest = mockGrantRequest;
const mockContinuationRequest = (overrides) => ({
    interact_ref: (0, uuid_1.v4)(),
    ...overrides
});
exports.mockContinuationRequest = mockContinuationRequest;
const mockAccessToken = (overrides) => ({
    access_token: {
        value: '99C36C2A4DB5BEBC',
        manage: `http://example.com/token/${(0, uuid_1.v4)()}`,
        access: [
            {
                type: 'incoming-payment',
                actions: ['create', 'read', 'list', 'complete']
            }
        ],
        expires_in: 600
    },
    ...overrides
});
exports.mockAccessToken = mockAccessToken;
const mockQuote = (overrides) => ({
    id: `https://example.com/.well-known/pay/quotes/${(0, uuid_1.v4)()}`,
    receiver: 'https://example.com/.well-known/peer',
    walletAddress: 'https://example.com/.well-known/pay',
    debitAmount: {
        value: '100',
        assetCode: 'USD',
        assetScale: 2
    },
    receiveAmount: {
        value: '90',
        assetCode: 'USD',
        assetScale: 2
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60000).toISOString(),
    method: 'ilp',
    ...overrides
});
exports.mockQuote = mockQuote;
const createTestDeps = async (overrides) => ({
    httpClient: await (0, exports.getDefaultHttpClient)(),
    logger: exports.silentLogger,
    useHttp: false,
    ...overrides
});
exports.createTestDeps = createTestDeps;
