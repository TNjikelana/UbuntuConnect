/// <reference types="node" />
import { KeyObject } from 'crypto';
export interface JWK {
    kid: string;
    alg: 'EdDSA';
    use?: 'sig';
    kty: 'OKP';
    crv: 'Ed25519';
    x: string;
}
export declare const generateJwk: ({ privateKey: providedPrivateKey, keyId }: {
    privateKey?: KeyObject | undefined;
    keyId: string;
}) => JWK;
