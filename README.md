# nodejs-googleapis

Node.js googleapis samples

## oauth scenarios

1. `oauth`认证过以后，去https://myaccount.google.com/permissions revoke 授权的应用，此时如果马上调用`oauth2client.revokeToken(<access_token>)`，会成功。
   如果 revoke 授权的应用后，等 1 分钟左右，再去调用`oauth2client.revokeToken(<access_token>)`方法，则失败。错误为：

```bash
revoke access token failed.
{ Error: invalid_token
  at Gaxios.<anonymous> (/Users/ldu020/workspace/nodejs-googleapis/node_modules/gaxios/src/gaxios.ts:74:15)
  at Generator.next (<anonymous>)
  at fulfilled (/Users/ldu020/workspace/nodejs-googleapis/node_modules/gaxios/build/src/gaxios.js:16:58)
  at <anonymous>
  at process._tickDomainCallback (internal/process/next_tick.js:228:7)
response:
 { config:
    { url: 'https://oauth2.googleapis.com/revoke?token=ya29.GlvcBqrJX-6-0cwI7ZtyJCiCskTuyTeEwQcLmNJyTYHtSkoLFkmtgmTjsSjxaLCVZdK1su_l2LrvVfZq0VDXooqYH9lXRZCtM7L5-rWEZfK_O058x8MI493wlf5n',
      method: 'POST',
      headers: [Object],
      validateStatus: [Function: validateStatus],
      paramsSerializer: [Function: paramsSerializer],
      responseType: 'json' },
   data:
    { error: 'invalid_token',
      error_description: 'Token expired or revoked' },
   headers:
    { 'alt-svc': 'quic=":443"; ma=2592000; v="46,44,43,39"',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      connection: 'close',
      'content-encoding': 'gzip',
      'content-type': 'application/json; charset=utf-8',
      date: 'Sat, 30 Mar 2019 11:00:55 GMT',
      expires: 'Mon, 01 Jan 1990 00:00:00 GMT',
      pragma: 'no-cache',
      server: 'ESF',
      'transfer-encoding': 'chunked',
      vary: 'Origin, X-Origin, Referer',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-xss-protection': '1; mode=block' },
   status: 400,
   statusText: 'Bad Request' },
config:
 { url: 'https://oauth2.googleapis.com/revoke?token=ya29.GlvcBqrJX-6-0cwI7ZtyJCiCskTuyTeEwQcLmNJyTYHtSkoLFkmtgmTjsSjxaLCVZdK1su_l2LrvVfZq0VDXooqYH9lXRZCtM7L5-rWEZfK_O058x8MI493wlf5n',
   method: 'POST',
   headers:
    { 'User-Agent': 'google-api-nodejs-client/3.1.0',
      Accept: 'application/json' },
   validateStatus: [Function: validateStatus],
   paramsSerializer: [Function: paramsSerializer],
   responseType: 'json' },
code: '400' }
```

## references

- https://developers.google.com/drive/api/v3/quickstart/nodejs
- https://myaccount.google.com/permissions
- https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=

## TODO

- https://stackoverflow.com/questions/48949299/using-google-api-refresh-token
