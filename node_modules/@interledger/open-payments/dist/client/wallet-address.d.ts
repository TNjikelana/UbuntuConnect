import { RouteDeps, UnauthenticatedResourceRequestArgs } from '.';
import { JWKS, WalletAddress, DIDDocument } from '../types';
export interface WalletAddressRoutes {
    get(args: UnauthenticatedResourceRequestArgs): Promise<WalletAddress>;
    getKeys(args: UnauthenticatedResourceRequestArgs): Promise<JWKS>;
    getDIDDocument(args: UnauthenticatedResourceRequestArgs): Promise<DIDDocument>;
}
export declare const createWalletAddressRoutes: (deps: RouteDeps) => WalletAddressRoutes;
