"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const _1 = require(".");
const handleValidationError = (deps, error, url, errorMessage) => {
    const validationError = error instanceof Error ? error.message : 'Unknown error';
    deps.logger.error({ url, validationError }, errorMessage);
    throw new _1.OpenPaymentsClientError(errorMessage, {
        description: validationError,
        validationErrors: [validationError]
    });
};
exports.handleValidationError = handleValidationError;
