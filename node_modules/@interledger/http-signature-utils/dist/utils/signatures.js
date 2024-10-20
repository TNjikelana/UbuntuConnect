"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSignatureHeaders = void 0;
const http_message_signatures_1 = require("http-message-signatures");
const createSignatureHeaders = async ({ request, privateKey, keyId }) => {
    const components = ['@method', '@target-uri'];
    if (request.headers['Authorization'] || request.headers['authorization']) {
        components.push('authorization');
    }
    if (request.body) {
        components.push('content-digest', 'content-length', 'content-type');
    }
    const signingKey = (0, http_message_signatures_1.createSigner)(privateKey, 'ed25519', keyId);
    const { headers } = await http_message_signatures_1.httpbis.signMessage({
        key: signingKey,
        name: 'sig1',
        params: ['keyid', 'created'],
        fields: components
    }, {
        method: request.method,
        url: request.url,
        headers: request.headers
    });
    return {
        Signature: headers['Signature'],
        'Signature-Input': headers['Signature-Input']
    };
};
exports.createSignatureHeaders = createSignatureHeaders;
