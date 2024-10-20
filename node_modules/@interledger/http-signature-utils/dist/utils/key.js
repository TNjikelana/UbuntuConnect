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
exports.loadBase64Key = exports.loadOrGenerateKey = exports.generateKey = exports.loadKey = void 0;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
/**
 * Loads a EdDSA-Ed25519 private key.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns The KeyObject of the loaded private key
 *
 */
function loadKey(keyFilePath) {
    let fileBuffer;
    try {
        fileBuffer = fs.readFileSync(keyFilePath);
    }
    catch (error) {
        throw new Error(`Could not load file: ${keyFilePath}`);
    }
    let key;
    try {
        key = crypto.createPrivateKey(fileBuffer);
    }
    catch (error) {
        throw new Error('File was loaded, but private key was invalid');
    }
    if (!isKeyEd25519(key)) {
        throw new Error('Private key did not have Ed25519 curve');
    }
    return key;
}
exports.loadKey = loadKey;
/**
 * Generates a EdDSA-Ed25519 private key, and optionally saves it in the given directory.
 *
 * @param args - The arguments used to specify where to optionally save the generated key
 * @returns The KeyObject that was generated
 *
 */
function generateKey(args) {
    const keypair = crypto.generateKeyPairSync('ed25519');
    if (args && args.dir) {
        if (!fs.existsSync(args.dir)) {
            fs.mkdirSync(args.dir);
        }
        fs.writeFileSync(`${args.dir}/${args.fileName || `private-key-${new Date().getTime()}`}.pem`, keypair.privateKey.export({ format: 'pem', type: 'pkcs8' }));
    }
    return keypair.privateKey;
}
exports.generateKey = generateKey;
/**
 * Loads a EdDSA-Ed25519 private key. If a path to the key was not provided,
 * or if there were any errors when trying to load the given key, a new key is generated and
 * optionally saved in a file.
 *
 * @param keyFilePath - The file path of the private key.
 * @param generateKeyArgs - The arguments used to specify where to optionally save the generated key
 * @returns The KeyObject of the loaded or generated private key
 *
 */
function loadOrGenerateKey(keyFilePath, generateKeyArgs) {
    if (keyFilePath) {
        try {
            return loadKey(keyFilePath);
        }
        catch {
            /* Could not load key, generating new one */
        }
    }
    return generateKey(generateKeyArgs);
}
exports.loadOrGenerateKey = loadOrGenerateKey;
/**
 * Loads a Base64 encoded EdDSA-Ed25519 private key.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns the KeyObject of the loaded private key, or undefined if the key was not EdDSA-Ed25519
 *
 */
function loadBase64Key(base64Key) {
    const privateKey = Buffer.from(base64Key, 'base64').toString('utf-8');
    const key = crypto.createPrivateKey(privateKey);
    if (isKeyEd25519(key)) {
        return key;
    }
}
exports.loadBase64Key = loadBase64Key;
function isKeyEd25519(key) {
    const jwk = key.export({ format: 'jwk' });
    return jwk.crv === 'Ed25519';
}
