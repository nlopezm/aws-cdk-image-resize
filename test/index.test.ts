import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ImageResize } from '../src';

test('Image resize', () => {
  const stack = new cdk.Stack();

  // WHEN
  new ImageResize(stack, 'TestStack');

  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::Lambda::Function', 2);
  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
});
