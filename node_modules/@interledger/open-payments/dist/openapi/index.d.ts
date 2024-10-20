/**
 * Returns the OpenAPI object for the Open Payments Resource Server OpenAPI spec.
 * This object allows validating requests and responses against the spec.
 * See more: https://github.com/interledger/open-payments/blob/main/packages/openapi/README.md
 */
export declare function getResourceServerOpenAPI(): Promise<import("@interledger/openapi").OpenAPI>;
/**
 * Returns the OpenAPI object for the Open Payments Wallet Address Server OpenAPI spec.
 * This object allows validating requests and responses against the spec.
 * See more: https://github.com/interledger/open-payments/blob/main/packages/openapi/README.md
 */
export declare function getWalletAddressServerOpenAPI(): Promise<import("@interledger/openapi").OpenAPI>;
/**
 * Returns the OpenAPI object for the Open Payments Auth Server OpenAPI spec.
 * This object allows validating requests and responses against the spec.
 * See more: https://github.com/interledger/open-payments/blob/main/packages/openapi/README.md
 */
export declare function getAuthServerOpenAPI(): Promise<import("@interledger/openapi").OpenAPI>;
