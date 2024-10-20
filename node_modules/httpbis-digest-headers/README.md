# HTTP Digest Headers

[![Node.js CI](https://github.com/interledger/httpbis-digest-headers/actions/workflows/nodejs.yml/badge.svg)](https://github.com/interledger/httpbis-digest-headers/actions/workflows/nodejs.yml)

Based on the draft specification for HTTP Digest Headers, this library facilitates the creation and verification of a Content-Digest header.

This is useful when verifying the content of a message body as part of signature verification.

## Specifications

- [HTTPBIS-DIGEST-HEADERS](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-digest-headers)

The library currently only supports sha-256 and sha-512 algorithms

## Examples

### Creating a digest header

```js
import { createContentDigestHeader } from 'httpbis-digest-headers';
request.setHeader('Content-Digest', createContentDigestHeader(messageBody, ['sha-256']))
```

### Verify a digest header

```js
import { verifyContentDigest } from 'httpbis-digest-headers';
const server = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const verified = verifyContentDigest(Buffer.concat(buffers), req.getHeader('Content-Digest'))
});```
