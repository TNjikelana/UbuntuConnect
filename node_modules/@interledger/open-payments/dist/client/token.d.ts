import { ResponseValidator } from '@interledger/openapi';
import { GrantOrTokenRequestArgs, BaseDeps, RouteDeps } from '.';
import { AccessToken } from '../types';
export interface TokenRoutes {
    rotate(args: GrantOrTokenRequestArgs): Promise<AccessToken>;
    revoke(args: GrantOrTokenRequestArgs): Promise<void>;
}
export declare const createTokenRoutes: (deps: RouteDeps) => TokenRoutes;
export declare const rotateToken: (deps: BaseDeps, args: GrantOrTokenRequestArgs, validateOpenApiResponse: ResponseValidator<AccessToken>) => Promise<AccessToken>;
export declare const revokeToken: (deps: BaseDeps, args: GrantOrTokenRequestArgs, validateOpenApiResponse: ResponseValidator<void>) => Promise<void>;
