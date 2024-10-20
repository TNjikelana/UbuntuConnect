"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenPaymentsClientError = void 0;
class OpenPaymentsClientError extends Error {
    constructor(message, args) {
        super(message);
        this.name = 'OpenPaymentsClientError';
        this.description = args.description;
        this.status = args.status;
        this.code = args.code;
        this.validationErrors = args.validationErrors;
    }
}
exports.OpenPaymentsClientError = OpenPaymentsClientError;
