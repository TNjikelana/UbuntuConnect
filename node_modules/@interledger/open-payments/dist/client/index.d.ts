/// <reference types="node" />
import { OpenAPI } from '@interledger/openapi';
import { LevelWithSilent, Logger } from 'pino';
import { IncomingPaymentRoutes, UnauthenticatedIncomingPaymentRoutes } from './incoming-payment';
import { WalletAddressRoutes } from './wallet-address';
import { HttpClient, InterceptorFn } from './requests';
import { GrantRoutes } from './grant';
import { OutgoingPaymentRoutes } from './outgoing-payment';
import { TokenRoutes } from './token';
import { QuoteRoutes } from './quote';
import { KeyLike } from 'crypto';
export * from './error';
export interface BaseDeps {
    httpClient: HttpClient;
    logger: Logger;
    useHttp: boolean;
}
export interface RouteDeps extends BaseDeps {
    httpClient: HttpClient;
    openApi?: OpenAPI;
    logger: Logger;
}
export interface UnauthenticatedResourceRequestArgs {
    /**
     * The full URL of the requested resource.
     *
     * For example, if the requested resource is an incoming payment:
     * ```
     * https://openpayments.guide/incoming-payments/08394f02-7b7b-45e2-b645-51d04e7c330c`
     * ```
     */
    url: string;
}
interface AuthenticatedRequestArgs {
    /**
     * The access token required to access the resource.
     * This token is provided when a grant is created.
     *
     * @see [Open Payments - Grant Request](https://openpayments.guide/apis/auth-server/operations/post-request/)
     */
    accessToken: string;
}
export interface GrantOrTokenRequestArgs extends UnauthenticatedResourceRequestArgs, AuthenticatedRequestArgs {
}
export interface ResourceRequestArgs extends UnauthenticatedResourceRequestArgs, AuthenticatedRequestArgs {
}
export interface CollectionRequestArgs extends UnauthenticatedResourceRequestArgs, AuthenticatedRequestArgs {
    /**
     * The wallet address URL of the requested collection.
     *
     * Example:
     * ```
     * https://openpayments.guide/alice`
     * ```
     */
    walletAddress: string;
}
export interface CreateUnauthenticatedClientArgs {
    /** Milliseconds to wait before timing out an HTTP request */
    requestTimeoutMs?: number;
    /** The custom logger instance to use. This defaults to the pino logger. */
    logger?: Logger;
    /** The desired logging level  */
    logLevel?: LevelWithSilent;
    /** If enabled, all requests will use http as protocol. Use in development mode only. */
    useHttp?: boolean;
    /** Enables or disables response validation against the Open Payments OpenAPI specs. Defaults to true. */
    validateResponses?: boolean;
}
export interface UnauthenticatedClient {
    walletAddress: WalletAddressRoutes;
    incomingPayment: UnauthenticatedIncomingPaymentRoutes;
}
/**
 * Creates an OpenPayments client that is only able to make requests for public fields.
 */
export declare const createUnauthenticatedClient: (args: CreateUnauthenticatedClientArgs) => Promise<UnauthenticatedClient>;
interface BaseAuthenticatedClientArgs extends CreateUnauthenticatedClientArgs {
    /** The wallet address which the client will identify itself by */
    walletAddressUrl: string;
}
interface PrivateKeyConfig {
    /** The private EdDSA-Ed25519 key (or the relative or absolute path to the key) with which requests will be signed */
    privateKey: string | KeyLike;
    /** The key identifier referring to the private key */
    keyId: string;
}
interface InterceptorConfig {
    /** The custom authenticated request interceptor to use. */
    authenticatedRequestInterceptor: InterceptorFn;
}
export type CreateAuthenticatedClientArgs = BaseAuthenticatedClientArgs & PrivateKeyConfig;
export type CreateAuthenticatedClientWithReqInterceptorArgs = BaseAuthenticatedClientArgs & InterceptorConfig;
export interface AuthenticatedClient extends Omit<UnauthenticatedClient, 'incomingPayment'> {
    incomingPayment: IncomingPaymentRoutes;
    outgoingPayment: OutgoingPaymentRoutes;
    grant: GrantRoutes;
    token: TokenRoutes;
    quote: QuoteRoutes;
}
/**
 * Creates an Open Payments client that exposes methods to call all of the Open Payments APIs.
 * Each request requiring authentication will be signed with the given private key.
 */
export declare function createAuthenticatedClient(args: CreateAuthenticatedClientArgs): Promise<AuthenticatedClient>;
/**
 * @experimental The `authenticatedRequestInterceptor` feature is currently experimental and might be removed
 * in upcoming versions. Use at your own risk! It offers the capability to add a custom method for
 * generating HTTP signatures. It is recommended to create the authenticated client with the `privateKey`
 * and `keyId` arguments. If both `authenticatedRequestInterceptor` and `privateKey`/`keyId` are provided, an error will be thrown.
 * @throws OpenPaymentsClientError
 */
export declare function createAuthenticatedClient(args: CreateAuthenticatedClientWithReqInterceptorArgs): Promise<AuthenticatedClient>;
