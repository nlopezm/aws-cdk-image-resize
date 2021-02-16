# AWS Image Resizer Construct Library

This construct library is inspired by [this blog](https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/) from the AWS official website and [this one](https://web.dev/serve-responsive-images/) from [web.dev](https://web.dev/), and provides a way to easily setup the required arquitecture to start serving performant images.

The goal of this library is to take image serving performance to the next level by formatting and resizing resources.

If the client is requesting an image and if the client supports *webp*, this construct will take care of returning a *webp* image (which is usually 80% lighter than the convencional jpg/png images).

**What about resizing?**
You might want to serve multiple image versions. Why would your mobile users pay the cost of loading the same big files desktop users need? 
Just pass `width` and/or `height` (in px) as query params and you will get original image cropped to the requested sizes.

This is how the client's code would look like:
```
<img
  srcset="https://cloudfront-url/path-to-your-image/image.ext?width=150 150w,
          https://cloudfront-url/path-to-your-image/image.ext?width=500 500w,
          https://cloudfront-url/path-to-your-image/image.ext?width=800 800w"
  src="https://cloudfront-url/path-to-your-image/image.ext"
>
```

Refer [here](https://web.dev/serve-responsive-images/#serve-multiple-image-versions) for more information on this!

## Image generation workflow
![image generation workflow](https://user-images.githubusercontent.com/32108036/108003950-44abb200-6fec-11eb-930b-9116b01f357b.png)
_Source: [AWS blog](https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/)_

1. Two Lambda@Edge triggers namely Viewer-Request and Origin-Response which are associated to a CloudFront distribution.
2. Amazon Simple Storage Service (Amazon S3) as origin.

Let’s understand what happens in these various steps 1 to 5

**Step 1:** The requested image URI is manipulated in the viewer-facing Lambda@Edge function to serve appropriate dimension and format. This happens before the request hits the cache. The URI should be the path to the original resource (e.g. /image.jpg).
The manipulated URI will look something like this: 
a. `/images.webp`, if webp supported by the client
b. `/images-${width}wx${height}h.webp`, in case width and/or height are supplied as query params

**Step 2**: CloudFront fetches the object from origin.

**Step 3:** If the required image is already present in the bucket or is generated and stored (via step 5), CloudFront returns the object to viewer. At this stage, the image is >cached.

**Step 4:**  The object from cache is returned to user.

**Step 5** Resize & format operations are invoked only when an image is not present in origin. A network call is made to the S3 bucket (origin) to fetch the source image and resized. The generated image is persisted back to the bucket and sent to CloudFront.

**Note:** Step 2,3 and 5 are executed only when the object is stale or does not exist in cache. Static resources like images should have a long Time to Live (TTL) as possible to improve cache-hit ratios.

_This step by step is also taken from [AWS blog](https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/) with some minor tweaks._

## How to use

```ts
import * as cdk from '@aws-cdk/core'
import { ImageResize } from 'aws-cdk-image-resize'

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new ImageResize(this, 'ImageResize', {
      s3BucketProps: { bucketName: 'image-resize-lib-test' },
    })
  }
}

```

This is the basic usage. All of the props are optional, but the construct is 100% customizable:
- s3BucketProps: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html
- originResponseLambdaProps: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html
- viewerRequestLambdaProps: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html
- cloudfrontDistributionProps: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-cloudfront-readme.html

## Resources created
This Construct will create
- 1 Lambda@Edge function for the Viewer Request
- 1 Lambda@Edge function for the Origin Response with permissions to write and read the S3 bucket. This lambda uses [sharp library](https://www.npmjs.com/package/sharp) under the hood
- 1 Cloudfront Distribution
- 1 S3 bucket

## Customizing lambdas

Everything is customizable, even lambda functions. In fact, I suggest customizing the Viewer Request function so that it only allows an specific set of dimensions.

```ts
import * as cdk from '@aws-cdk/core'
import { ImageResize } from 'aws-cdk-image-resize'
import * as lambda from '@aws-cdk/aws-lambda'

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new ImageResize(this, 'ImageResize', {
      s3BucketProps: { bucketName: 'image-resize-lib-test' },
      viewerRequestLambdaProps: {
       // In practice, you will probably want to use lambda.Code.fromAsset
       // @see https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html
        code: lambda.Code.fromInline(`exports.handler = function(event, ctx, cb) {
          const request = event.Records[0].cf.request
          const { height, width } = querystring.parse(request.querystring);
          // ...
          if(dimensionAllowed) {
            request.uri = `/path/to/file/original-${width}wx${height}h.webp`
          } else { 
            request.uri = '/path/to/file/original.webp'
          }
          return cb(null, request);
        }
      `),
      },
    })
  }
}
```

Just make sure the request.uri is in one of the following formats.
Let's take `/images/umbrella.jpg` as our original uri.

- If you want the image to be formatted to other extension, then modify its extension. In case of `webp`, the final uri would be `/images/umbrella.webp`.
See other available extensions in [sharp library](https://www.npmjs.com/package/sharp).
- If you want to format the image to specific `width` and `height`, then return `/images/umbrella-${width}wx${height}h.${ext}`. e.g.: `width=500`, `height=300`, `extension=webp` -  `/images/umbrella-500wx300h.webp`
- If you want to define it's width and let the height to adapt automatically to keep the aspect ratio, pass `0` as `height`. e.g.: `width=500`, `height=[adapted to keep aspect ratio]`, `extension=webp` -  `/images/umbrella-500wx0h.webp`
- If you want to define it's `height` and let the `width` to adapt automatically to keep the aspect ratio, pass `0` as `width`. e.g.: `height=500`, `width=[adapted to keep aspect ratio]`, `extension=webp` -  `/images/umbrella-0wx500h.webp`

And that's it. The rest of the job will be done by the `Origin Response Lambda`
