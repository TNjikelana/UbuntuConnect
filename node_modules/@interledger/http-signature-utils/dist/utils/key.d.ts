/// <reference types="node" />
import * as crypto from 'crypto';
/**
 * Loads a EdDSA-Ed25519 private key.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns The KeyObject of the loaded private key
 *
 */
export declare function loadKey(keyFilePath: string): crypto.KeyObject;
interface GenerateKeyArgs {
    /** The directory where to save the key */
    dir?: string;
    /** The fileName of the saved key, without the file extension. `args.dir` must be provided for the fileName to register. */
    fileName?: string;
}
/**
 * Generates a EdDSA-Ed25519 private key, and optionally saves it in the given directory.
 *
 * @param args - The arguments used to specify where to optionally save the generated key
 * @returns The KeyObject that was generated
 *
 */
export declare function generateKey(args?: GenerateKeyArgs): crypto.KeyObject;
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
export declare function loadOrGenerateKey(keyFilePath?: string, generateKeyArgs?: GenerateKeyArgs): crypto.KeyObject;
/**
 * Loads a Base64 encoded EdDSA-Ed25519 private key.
 *
 * @param keyFilePath - The file path of the private key.
 * @returns the KeyObject of the loaded private key, or undefined if the key was not EdDSA-Ed25519
 *
 */
export declare function loadBase64Key(base64Key: string): crypto.KeyObject | undefined;
export {};
