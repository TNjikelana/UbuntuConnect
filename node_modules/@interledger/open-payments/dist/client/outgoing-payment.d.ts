import { ResponseValidator } from '@interledger/openapi';
import { BaseDeps, ResourceRequestArgs, CollectionRequestArgs, RouteDeps } from '.';
import { CreateOutgoingPaymentArgs, OutgoingPayment, OutgoingPaymentPaginationResult, OutgoingPaymentWithSpentAmounts, PaginationArgs } from '../types';
export interface OutgoingPaymentRoutes {
    get(args: ResourceRequestArgs): Promise<OutgoingPayment>;
    list(args: CollectionRequestArgs, pagination?: PaginationArgs): Promise<OutgoingPaymentPaginationResult>;
    create(requestArgs: ResourceRequestArgs, createArgs: CreateOutgoingPaymentArgs): Promise<OutgoingPaymentWithSpentAmounts>;
}
export declare const createOutgoingPaymentRoutes: (deps: RouteDeps) => OutgoingPaymentRoutes;
export declare const getOutgoingPayment: (deps: BaseDeps, requestArgs: ResourceRequestArgs, validateOpenApiResponse: ResponseValidator<OutgoingPayment>) => Promise<{
    id: string;
    walletAddress: string;
    quoteId?: string | undefined;
    failed?: boolean | undefined;
    receiver: string;
    receiveAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    debitAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    sentAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    metadata?: {
        [key: string]: unknown;
    } | undefined;
    createdAt: string;
    updatedAt: string;
}>;
export declare const createOutgoingPayment: (deps: BaseDeps, requestArgs: ResourceRequestArgs, validateOpenApiResponse: ResponseValidator<OutgoingPayment>, createArgs: CreateOutgoingPaymentArgs) => Promise<{
    id: string;
    walletAddress: string;
    quoteId?: string | undefined;
    failed?: boolean | undefined;
    receiver: string;
    receiveAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    debitAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    sentAmount: {
        value: string;
        assetCode: string;
        assetScale: number;
    };
    metadata?: {
        [key: string]: unknown;
    } | undefined;
    createdAt: string;
    updatedAt: string;
}>;
export declare const listOutgoingPayments: (deps: BaseDeps, requestArgs: CollectionRequestArgs, validateOpenApiResponse: ResponseValidator<OutgoingPaymentPaginationResult>, pagination?: PaginationArgs) => Promise<OutgoingPaymentPaginationResult>;
export declare const validateOutgoingPayment: (payment: OutgoingPayment) => OutgoingPayment;
