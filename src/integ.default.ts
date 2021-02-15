import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { ImageEnhancer } from './index';

const app = new App();
const stack = new Stack(app, 'ImageEnhancerStack');

new ImageEnhancer(stack, 'ImageEnhancerLib', {
  s3BucketProps: {
    autoDeleteObjects: true,
    bucketName: 'image-enhancer-lib-test',
    removalPolicy: RemovalPolicy.DESTROY,
  },
  cloudfrontDistributionProps: {
    errorResponses: [{ httpStatus: 404, responsePagePath: '/path/to/default/object' }],
  },
});
