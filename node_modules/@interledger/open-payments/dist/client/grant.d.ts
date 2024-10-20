import { GrantOrTokenRequestArgs, RouteDeps, UnauthenticatedResourceRequestArgs } from '.';
import { PendingGrant, Grant, GrantContinuation, GrantRequest, GrantContinuationRequest } from '../types';
export interface GrantRouteDeps extends RouteDeps {
    client: string;
}
export interface GrantRoutes {
    request(postArgs: UnauthenticatedResourceRequestArgs, args: Omit<GrantRequest, 'client'>): Promise<PendingGrant | Grant>;
    continue(postArgs: GrantOrTokenRequestArgs, args?: GrantContinuationRequest): Promise<Grant | GrantContinuation>;
    cancel(postArgs: GrantOrTokenRequestArgs): Promise<void>;
}
export declare const createGrantRoutes: (deps: GrantRouteDeps) => GrantRoutes;
