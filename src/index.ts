import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from '@aws-cdk/aws-lambda-nodejs';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
import { DistributionProps, FunctionProps } from './types';
export * from './types';

export interface IImageResizeProps {
  cloudfrontDistributionProps?: DistributionProps;
  originResponseLambdaProps?: NodejsFunctionProps;
  s3BucketProps?: s3.BucketProps;
  viewerRequestLambdaProps?: FunctionProps;
}

export class ImageResize extends Construct {
  constructor(scope: Construct, id: string, props?: IImageResizeProps) {
    super(scope, id);

    const { s3BucketProps, originResponseLambdaProps, viewerRequestLambdaProps, cloudfrontDistributionProps } =
      props || {};

    const imagesBucket = new s3.Bucket(this, 'Bucket', s3BucketProps);

    const imageOriginResponseLambda = new NodejsFunction(this, 'OriginResponseFunction', {
      bundling: {
        minify: true,
        nodeModules: ['sharp'],
      },
      entry: `${__dirname}/../lambda/image-origin-response-function/index.js`,
      functionName: 'image-origin-response-function',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      ...originResponseLambdaProps,
    });

    imagesBucket.grantRead(imageOriginResponseLambda);
    imagesBucket.grantPut(imageOriginResponseLambda);

    const imageViewerRequestLambda = new lambda.Function(this, 'ViewerRequestFunction', {
      code: lambda.Code.fromAsset(`${__dirname}/../lambda/image-viewer-request-function`),
      functionName: 'image-viewer-request-function',
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      ...viewerRequestLambdaProps,
    });

    // Cloudfront distribution for the S3 bucket.
    new cloudfront.Distribution(this, 'Distribution', {
      ...cloudfrontDistributionProps,
      defaultBehavior: {
        origin: new origins.S3Origin(imagesBucket),
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
            functionVersion: imageOriginResponseLambda.currentVersion,
          },
          {
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            functionVersion: imageViewerRequestLambda.currentVersion,
          },
        ],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        ...cloudfrontDistributionProps?.defaultBehavior,
      },
    });
  }
}
