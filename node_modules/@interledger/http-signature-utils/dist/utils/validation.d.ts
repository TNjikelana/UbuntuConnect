import { RequestLike } from './signatures';
import { JWK } from './jwk';
export declare function validateSignatureHeaders(request: RequestLike): boolean;
export declare function validateSignature(clientKey: JWK, request: RequestLike): Promise<boolean>;
