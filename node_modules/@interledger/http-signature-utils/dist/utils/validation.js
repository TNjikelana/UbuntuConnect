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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignature = exports.validateSignatureHeaders = void 0;
const crypto = __importStar(require("crypto"));
const httpbis_digest_headers_1 = require("httpbis-digest-headers");
const jose_1 = require("jose");
function validateSignatureHeaders(request) {
    const sig = request.headers['signature'];
    const sigInput = request.headers['signature-input'];
    if (!sig ||
        !sigInput ||
        typeof sig !== 'string' ||
        typeof sigInput !== 'string')
        return false;
    const sigInputComponents = getSigInputComponents(sigInput);
    return (!!sigInputComponents &&
        validateSigInputComponents(sigInputComponents, request));
}
exports.validateSignatureHeaders = validateSignatureHeaders;
async function validateSignature(clientKey, request) {
    const sig = request.headers['signature'];
    const sigInput = request.headers['signature-input'];
    const challenge = sigInputToChallenge(sigInput, request);
    if (!challenge) {
        return false;
    }
    const publicKey = (await (0, jose_1.importJWK)({ ...clientKey }));
    const data = Buffer.from(challenge);
    return crypto.verify(null, data, publicKey, Buffer.from(sig.replace('sig1=', ''), 'base64'));
}
exports.validateSignature = validateSignature;
function sigInputToChallenge(sigInput, request) {
    const sigInputComponents = getSigInputComponents(sigInput);
    if (!sigInputComponents ||
        !validateSigInputComponents(sigInputComponents, request))
        return null;
    // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures-09#section-2.3
    let signatureBase = '';
    for (const component of sigInputComponents) {
        if (component === '@method') {
            signatureBase += `"@method": ${request.method}\n`;
        }
        else if (component === '@target-uri') {
            signatureBase += `"@target-uri": ${request.url}\n`;
        }
        else {
            signatureBase += `"${component}": ${request.headers[component]}\n`;
        }
    }
    signatureBase += `"@signature-params": ${request.headers['signature-input']?.replace('sig1=', '')}`;
    return signatureBase;
}
function getSigInputComponents(sigInput) {
    // https://datatracker.ietf.org/doc/html/rfc8941#section-4.1.1.1
    const messageComponents = sigInput
        .split('sig1=')[1]
        ?.split(';')[0]
        ?.split(' ');
    return messageComponents
        ? messageComponents.map((component) => component.replace(/[()"]/g, ''))
        : null;
}
function validateSigInputComponents(sigInputComponents, request) {
    // https://datatracker.ietf.org/doc/html/draft-ietf-gnap-core-protocol#section-7.3.1
    for (const component of sigInputComponents) {
        // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures-09#section-2.1
        if (component !== component.toLowerCase())
            return false;
    }
    const isValidContentDigest = !sigInputComponents.includes('content-digest') ||
        (!!request.headers['content-digest'] &&
            !!request.headers['content-length'] &&
            !!request.headers['content-type'] &&
            request.body &&
            Object.keys(request.body).length > 0 &&
            sigInputComponents.includes('content-digest') &&
            (0, httpbis_digest_headers_1.verifyContentDigest)(request.body, request.headers['content-digest']));
    return !(!isValidContentDigest ||
        !sigInputComponents.includes('@method') ||
        !sigInputComponents.includes('@target-uri') ||
        (request.headers['authorization'] &&
            !sigInputComponents.includes('authorization')));
}
