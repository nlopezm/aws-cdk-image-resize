import { Duration } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { DistributionProps, FunctionProps } from './types';
export * from './types';

export interface IImageResizeProps {
  cloudfrontDistributionProps?: DistributionProps;
  originResponseLambdaProps?: NodejsFunctionProps;
  s3BucketProps?: s3.BucketProps;
  viewerRequestLambdaProps?: FunctionProps;
}

export class ImageResize extends Construct {
  distribution: cloudfront.Distribution;
  imageOriginResponseLambda: NodejsFunction;
  imagesBucket: s3.Bucket;
  imageViewerRequestLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: IImageResizeProps) {
    super(scope, id);

    const { s3BucketProps, originResponseLambdaProps, viewerRequestLambdaProps, cloudfrontDistributionProps } =
      props || {};

    this.imagesBucket = new s3.Bucket(this, 'Bucket', s3BucketProps);

    this.imageOriginResponseLambda = new NodejsFunction(this, 'OriginResponseFunction', {
      bundling: {
        minify: true,
        nodeModules: ['sharp'],
      },
      entry: `${__dirname}/../lambda/image-origin-response-function/index.js`,
      functionName: 'image-origin-response-function',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(15),
      ...originResponseLambdaProps,
    });

    this.imagesBucket.grantRead(this.imageOriginResponseLambda);
    this.imagesBucket.grantPut(this.imageOriginResponseLambda);

    this.imageViewerRequestLambda = new lambda.Function(this, 'ViewerRequestFunction', {
      code: lambda.Code.fromAsset(`${__dirname}/../lambda/image-viewer-request-function`),
      functionName: 'image-viewer-request-function',
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      ...viewerRequestLambdaProps,
    });

    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      cachePolicyName: 'images-cache-policy',
      defaultTtl: Duration.days(365), // 1 year
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      maxTtl: Duration.days(365 * 2), // 2 years
      minTtl: Duration.days(30 * 3), // 3 months
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList('height', 'width'),
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI');
    this.imagesBucket.grantRead(originAccessIdentity);

    // Cloudfront distribution for the S3 bucket.
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      ...cloudfrontDistributionProps,
      defaultBehavior: {
        origin: new origins.S3Origin(this.imagesBucket, { originAccessIdentity }),
        cachePolicy,
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
            functionVersion: this.imageOriginResponseLambda.currentVersion,
          },
          {
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            functionVersion: this.imageViewerRequestLambda.currentVersion,
          },
        ],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        ...cloudfrontDistributionProps?.defaultBehavior,
      },
    });
  }
}
