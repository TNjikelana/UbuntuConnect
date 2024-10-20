"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwk = void 0;
const crypto_1 = require("crypto");
const generateJwk = ({ privateKey: providedPrivateKey, keyId }) => {
    if (!keyId.trim()) {
        throw new Error('KeyId cannot be empty');
    }
    const privateKey = providedPrivateKey
        ? providedPrivateKey
        : (0, crypto_1.generateKeyPairSync)('ed25519').privateKey;
    const jwk = (0, crypto_1.createPublicKey)(privateKey).export({
        format: 'jwk'
    });
    if (jwk.x === undefined) {
        throw new Error('Failed to derive public key');
    }
    if (jwk.crv !== 'Ed25519' || jwk.kty !== 'OKP' || !jwk.x) {
        throw new Error('Key is not EdDSA-Ed25519');
    }
    return {
        alg: 'EdDSA',
        kid: keyId,
        kty: jwk.kty,
        crv: jwk.crv,
        x: jwk.x
    };
};
exports.generateJwk = generateJwk;
