import { ResponseValidator } from '@interledger/openapi';
import { ResourceRequestArgs, BaseDeps, RouteDeps } from '.';
import { CreateQuoteArgs, Quote } from '../types';
export interface QuoteRoutes {
    get(args: ResourceRequestArgs): Promise<Quote>;
    create(createArgs: ResourceRequestArgs, createQuoteArgs: CreateQuoteArgs): Promise<Quote>;
}
export declare const createQuoteRoutes: (deps: RouteDeps) => QuoteRoutes;
export declare const getQuote: (deps: BaseDeps, args: ResourceRequestArgs, validateOpenApiResponse: ResponseValidator<Quote>) => Promise<{
    id: string;
    walletAddress: string;
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
    method: "ilp";
    expiresAt?: string | undefined;
    createdAt: string;
}>;
export declare const createQuote: (deps: BaseDeps, createArgs: ResourceRequestArgs, validateOpenApiResponse: ResponseValidator<Quote>, createQuoteArgs: CreateQuoteArgs) => Promise<{
    id: string;
    walletAddress: string;
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
    method: "ilp";
    expiresAt?: string | undefined;
    createdAt: string;
}>;
