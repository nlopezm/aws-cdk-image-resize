import * as cdk from 'aws-cdk-lib';
import { ImageResize } from '../src';
import '@aws-cdk/assert/jest';

it('Image resize', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  new ImageResize(stack, 'TestStack');
  expect(stack).toHaveResource('AWS::Lambda::Function');
  expect(stack).toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('AWS::CloudFront::Distribution');
});
