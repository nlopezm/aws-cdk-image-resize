import * as cdk from '@aws-cdk/core';
import { ImageEnhancer } from '../src';
import '@aws-cdk/assert/jest';

it('Image enhancer', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  new ImageEnhancer(stack, 'TestStack');
  expect(stack).toHaveResource('AWS::Lambda::Function');
  expect(stack).toHaveResource('AWS::S3::Bucket');
  expect(stack).toHaveResource('AWS::CloudFront::Distribution');
});
