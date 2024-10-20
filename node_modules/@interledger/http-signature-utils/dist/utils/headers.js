"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyId = exports.createHeaders = void 0;
const httpbis_digest_headers_1 = require("httpbis-digest-headers");
const signatures_1 = require("./signatures");
const createContentHeaders = (body) => {
    return {
        'Content-Digest': (0, httpbis_digest_headers_1.createContentDigestHeader)(JSON.stringify(JSON.parse(body)), ['sha-512']),
        'Content-Length': Buffer.from(body, 'utf-8').length.toString(),
        'Content-Type': 'application/json'
    };
};
const createHeaders = async ({ request, privateKey, keyId }) => {
    const contentHeaders = request.body && createContentHeaders(request.body);
    if (contentHeaders) {
        request.headers = { ...request.headers, ...contentHeaders };
    }
    const signatureHeaders = await (0, signatures_1.createSignatureHeaders)({
        request,
        privateKey,
        keyId
    });
    return {
        ...contentHeaders,
        ...signatureHeaders
    };
};
exports.createHeaders = createHeaders;
const KEY_ID_PREFIX = 'keyid="';
const getKeyId = (signatureInput) => {
    const keyIdParam = signatureInput
        .split(';')
        .find((param) => param.startsWith(KEY_ID_PREFIX));
    // Trim prefix and quotes
    return keyIdParam?.slice(KEY_ID_PREFIX.length, -1);
};
exports.getKeyId = getKeyId;
