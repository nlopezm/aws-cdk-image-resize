/* eslint-disable @typescript-eslint/no-var-requires */
const sharp = require('sharp');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ signatureVersion: 'v4' });

/**
 * @param {{uri: String}} request
 * @returns {{key: String, prefix: String, extension: String, width?: Number, height?: Number}}
 */
exports.extractDataFromUri = request => {
  const uri = request.uri;
  // AWS key is the URI without the initial '/'
  const key = uri.substring(1);

  // Try to match dimensions first
  // e.g.: /path/to/file-100wx100h.webp
  const dimensionMatch = uri.match(/\/(.*)-([0-9]+)wx([0-9]+)h\.([^.]*)$/);
  if (dimensionMatch)
    return {
      key,
      prefix: dimensionMatch[1],
      width: parseInt(dimensionMatch[2]),
      height: parseInt(dimensionMatch[3]),
      extension: dimensionMatch[4],
    };

  // If no dimensions included, we just care about the prefix and the extension
  const simpleMatch = uri.match(/\/(.*)\.([^.]*)$/);

  return { key, prefix: simpleMatch[1], extension: simpleMatch[2] };
};

exports.handler = async (event, _context, callback) => {
  const response = event.Records[0].cf.response;

  const request = event.Records[0].cf.request;

  // Extracting bucket name. domainName looks like this: bucket-name.s3.region.amazonaws.com"
  const [, Bucket] = request.origin.s3.domainName.match(/(.*).s3./);

  if (Number(response.status) !== 404) {
    if (Number(response.status) !== 200) response.status = 400;
    callback(null, response);
    return;
  }

  // Image not found in bucket
  let params;
  try {
    params = this.extractDataFromUri(request);
  } catch (e) {
    callback(null, response);
    return;
  }

  const { Contents } = await s3
    .listObjects({
      Bucket,
      // List all keys starting with path/to/file.
      Prefix: params.prefix + '.',
    })
    .promise();

  if (!Contents.length) {
    callback(null, response);
    return;
  }

  const baseImageKey = (() => {
    /**
     * Try to find an existent image for the requested extension.
     * If there isn't one, the use as base image the first from the Contents array
     */
    const found = Contents.find(({ Key }) => Key.split(`${params.prefix}.`)[1] === params.extension);
    if (found) return found.Key;
    return Contents[0].Key;
  })();

  // Use the found key to get the image from the s3 bucket
  const { Body, ContentType } = await s3.getObject({ Key: baseImageKey, Bucket }).promise();

  const sharpPromise = sharp(Body);

  // If dimensions passed, resize base image
  if (params.width || params.height) {
    // Allow to pass only one of width or height
    sharpPromise.resize(params.width || undefined, params.height || undefined);
  }
  // If the requested extension is different than the base image extension, then
  // format it to the new extension
  if (ContentType !== `image/${params.extension}`) sharpPromise.toFormat(params.extension);

  const buffer = await sharpPromise.toBuffer();

  // Save the new image to s3 bucket. Don't await for this to finish.
  // Even if the upload fails we return the converted image
  s3.putObject({
    Body: buffer,
    Bucket,
    ContentType: 'image/' + params.extension,
    CacheControl: 'max-age=31536000',
    Key: params.key,
    StorageClass: 'STANDARD',
  }).promise();

  response.status = 200;
  response.body = buffer.toString('base64');
  response.bodyEncoding = 'base64';
  response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/' + params.extension }];
  callback(null, response);
};
