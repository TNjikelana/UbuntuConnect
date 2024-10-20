import { ResponseValidator } from '@interledger/openapi';
import { BaseDeps, ResourceRequestArgs, CollectionRequestArgs, RouteDeps, UnauthenticatedResourceRequestArgs } from '.';
import { IncomingPayment, CreateIncomingPaymentArgs, PaginationArgs, IncomingPaymentPaginationResult, PublicIncomingPayment, IncomingPaymentWithPaymentMethods } from '../types';
type AnyIncomingPayment = IncomingPayment | IncomingPaymentWithPaymentMethods;
export interface IncomingPaymentRoutes {
    get(args: ResourceRequestArgs): Promise<IncomingPaymentWithPaymentMethods>;
    getPublic(args: UnauthenticatedResourceRequestArgs): Promise<PublicIncomingPayment>;
    create(args: ResourceRequestArgs, createArgs: CreateIncomingPaymentArgs): Promise<IncomingPaymentWithPaymentMethods>;
    complete(args: ResourceRequestArgs): Promise<IncomingPayment>;
    list(args: CollectionRequestArgs, pagination?: PaginationArgs): Promise<IncomingPaymentPaginationResult>;
}
export declare const createIncomingPaymentRoutes: (deps: RouteDeps) => IncomingPaymentRoutes;
export interface UnauthenticatedIncomingPaymentRoutes {
    get(args: UnauthenticatedResourceRequestArgs): Promise<PublicIncomingPayment>;
}
export declare const createUnauthenticatedIncomingPaymentRoutes: (deps: RouteDeps) => UnauthenticatedIncomingPaymentRoutes;
export declare const getIncomingPayment: (deps: BaseDeps, args: ResourceRequestArgs, validateOpenApiResponse?: ResponseValidator<IncomingPaymentWithPaymentMethods>) => Promise<IncomingPaymentWithPaymentMethods>;
export declare const getPublicIncomingPayment: (deps: BaseDeps, args: UnauthenticatedResourceRequestArgs, validateOpenApiResponse?: ResponseValidator<PublicIncomingPayment>) => Promise<{
    receivedAmount?: {
        value: string;
        assetCode: string;
        assetScale: number;
    } | undefined;
    authServer: string;
}>;
export declare const createIncomingPayment: (deps: BaseDeps, requestArgs: ResourceRequestArgs, createArgs: CreateIncomingPaymentArgs, validateOpenApiResponse?: ResponseValidator<IncomingPaymentWithPaymentMethods>) => Promise<IncomingPaymentWithPaymentMethods>;
export declare const completeIncomingPayment: (deps: BaseDeps, args: ResourceRequestArgs, validateOpenApiResponse?: ResponseValidator<IncomingPayment>) => Promise<{
    id: string;
    walletAddress: string;
    completed: boolean;
    incomingAmount?: {
        value: string;
        assetCode: string;
        assetScale: number;
    } | undefined;
    receivedAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    expiresAt?: string | undefined;
    metadata?: {
        [key: string]: unknown;
    } | undefined;
    createdAt: string;
    updatedAt: string;
}>;
export declare const listIncomingPayment: (deps: BaseDeps, args: CollectionRequestArgs, validateOpenApiResponse?: ResponseValidator<IncomingPaymentPaginationResult>, pagination?: PaginationArgs) => Promise<IncomingPaymentPaginationResult>;
export declare const validateIncomingPayment: <T extends AnyIncomingPayment>(payment: T) => T;
export declare const validateCreatedIncomingPayment: (payment: IncomingPaymentWithPaymentMethods) => IncomingPaymentWithPaymentMethods;
export declare const validateCompletedIncomingPayment: (payment: IncomingPayment) => IncomingPayment;
export {};
