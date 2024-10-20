"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestKeys = void 0;
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const jwk_1 = require("../utils/jwk");
function generateTestKeys() {
    const { privateKey } = crypto_1.default.generateKeyPairSync('ed25519');
    return {
        publicKey: (0, jwk_1.generateJwk)({
            keyId: (0, uuid_1.v4)(),
            privateKey
        }),
        privateKey
    };
}
exports.generateTestKeys = generateTestKeys;
