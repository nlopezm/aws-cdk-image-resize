/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const querystring = require('querystring');

const SKIPPED_EXTENSIONS = ['svg'];

const WEBP = 'webp';
const regex = /(.*)\.([^.]*)$/;

/**
 * @param {{headers: Object, uri: String}} request
 * @returns {{extension: String, prefix: String}}
 */
exports.getDataFromRequest = request => {
  const headers = request.headers;
  // URI of original image
  const uri = request.uri;

  // parse the prefix, image name and extension from the uri.
  // In our case /path-to-image/image.[original-extension]
  const match = uri.match(/(.*)\.([^.]*)$/);
  const prefix = match[1];
  let extension = match[2];

  // read the accept header to determine if webp is supported.
  const accept = headers['accept'] ? headers['accept'][0].value : '';

  // Don't modify the extension if it is skipped
  if (SKIPPED_EXTENSIONS.includes(extension)) return { extension, prefix };

  // check support for webp
  if (accept.includes(WEBP)) extension = WEBP;

  return { extension, prefix };
};

exports.handler = (event, _context, callback) => {
  const request = event.Records[0].cf.request;

  if (request.uri === '/') return callback(Error(403));

  if (!request.uri.match(regex)) return callback(null, request);

  const { extension, prefix } = this.getDataFromRequest(request);

  // Don't do any formatting for skipped extensions
  if (SKIPPED_EXTENSIONS.includes(extension)) {
    callback(null, request);
    return;
  }

  // parse the querystrings key-value pairs. In our case it would be d=100x100
  let { height, width } = querystring.parse(request.querystring);

  // if no dimensions, just pass the request but modifying the extension
  if (!width && !height) {
    request.uri = `${prefix}.${extension}`;
    callback(null, request);
    return;
  }

  const forwardUri = `${prefix}-${width || 0}wx${height || 0}h.${extension}`;

  request.uri = forwardUri;
  callback(null, request);
};
