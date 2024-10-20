/// <reference types="node" />
import { type KeyLike } from 'crypto';
import { Request } from 'http-message-signatures';
export interface RequestLike extends Request {
    body?: string;
}
export interface SignOptions {
    request: RequestLike;
    privateKey: KeyLike;
    keyId: string;
}
export interface SignatureHeaders {
    Signature: string;
    'Signature-Input': string;
}
export declare const createSignatureHeaders: ({ request, privateKey, keyId }: SignOptions) => Promise<SignatureHeaders>;
