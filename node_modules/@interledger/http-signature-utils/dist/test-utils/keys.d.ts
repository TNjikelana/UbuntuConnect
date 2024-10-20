/// <reference types="node" />
import crypto from 'crypto';
import { JWK } from '../utils/jwk';
export type TestKeys = {
    publicKey: JWK;
    privateKey: crypto.KeyObject;
};
export declare function generateTestKeys(): TestKeys;
