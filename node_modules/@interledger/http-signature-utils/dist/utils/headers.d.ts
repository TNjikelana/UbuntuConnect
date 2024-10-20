import { SignatureHeaders, SignOptions } from './signatures';
interface ContentHeaders {
    'Content-Digest': string;
    'Content-Length': string;
    'Content-Type': string;
}
export interface Headers extends SignatureHeaders, Partial<ContentHeaders> {
}
export declare const createHeaders: ({ request, privateKey, keyId }: SignOptions) => Promise<Headers>;
export declare const getKeyId: (signatureInput: string) => string | undefined;
export {};
