"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessAction = exports.AccessType = exports.isFinalizedGrant = exports.isPendingGrant = exports.getASPath = exports.getRSPath = exports.getWAPath = void 0;
const getWAPath = (path) => path;
exports.getWAPath = getWAPath;
const getRSPath = (path) => path;
exports.getRSPath = getRSPath;
const getASPath = (path) => path;
exports.getASPath = getASPath;
const isPendingGrant = (grant) => !!grant.interact;
exports.isPendingGrant = isPendingGrant;
const isFinalizedGrant = (grant) => !!grant.access_token;
exports.isFinalizedGrant = isFinalizedGrant;
exports.AccessType = {
    IncomingPayment: 'incoming-payment',
    OutgoingPayment: 'outgoing-payment',
    Quote: 'quote'
};
exports.AccessAction = Object.freeze({
    Create: 'create',
    Read: 'read',
    ReadAll: 'read-all',
    Complete: 'complete',
    List: 'list',
    ListAll: 'list-all'
});
