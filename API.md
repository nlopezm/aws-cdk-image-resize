# API Reference

**Classes**

Name|Description
----|-----------
[ImageResize](#aws-cdk-image-resize-imageresize)|*No description*


**Structs**

Name|Description
----|-----------
[DistributionProps](#aws-cdk-image-resize-distributionprops)|Properties for a Distribution.
[FunctionProps](#aws-cdk-image-resize-functionprops)|*No description*


**Interfaces**

Name|Description
----|-----------
[IImageResizeProps](#aws-cdk-image-resize-iimageresizeprops)|*No description*



## class ImageResize  <a id="aws-cdk-image-resize-imageresize"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new ImageResize(scope: Construct, id: string, props?: IImageResizeProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[IImageResizeProps](#aws-cdk-image-resize-iimageresizeprops)</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**distribution** | <code>[aws_cloudfront.Distribution](#aws-cdk-lib-aws-cloudfront-distribution)</code> | <span></span>
**imageOriginResponseLambda** | <code>[aws_lambda_nodejs.NodejsFunction](#aws-cdk-lib-aws-lambda-nodejs-nodejsfunction)</code> | <span></span>
**imageViewerRequestLambda** | <code>[aws_lambda.Function](#aws-cdk-lib-aws-lambda-function)</code> | <span></span>
**imagesBucket** | <code>[aws_s3.Bucket](#aws-cdk-lib-aws-s3-bucket)</code> | <span></span>



## struct DistributionProps  <a id="aws-cdk-image-resize-distributionprops"></a>


Properties for a Distribution.



Name | Type | Description 
-----|------|-------------
**additionalBehaviors**? | <code>Map<string, [aws_cloudfront.BehaviorOptions](#aws-cdk-lib-aws-cloudfront-behavioroptions)></code> | Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.<br/>__*Default*__: no additional behaviors are added.
**certificate**? | <code>[aws_certificatemanager.ICertificate](#aws-cdk-lib-aws-certificatemanager-icertificate)</code> | A certificate to associate with the distribution.<br/>__*Default*__: the CloudFront wildcard certificate (*.cloudfront.net) will be used.
**comment**? | <code>string</code> | Any comments you want to include about the distribution.<br/>__*Default*__: no comment
**defaultBehavior**? | <code>[aws_cloudfront.AddBehaviorOptions](#aws-cdk-lib-aws-cloudfront-addbehavioroptions)</code> | The default behavior for the distribution.<br/>__*Optional*__
**defaultRootObject**? | <code>string</code> | The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution. If no default object is set, the request goes to the origin's root (e.g., example.com/).<br/>__*Default*__: no default root object
**domainNames**? | <code>Array<string></code> | Alternative domain names for this distribution.<br/>__*Default*__: The distribution will only support the default generated name (e.g., d111111abcdef8.cloudfront.net)
**enableIpv6**? | <code>boolean</code> | Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address.<br/>__*Default*__: true
**enableLogging**? | <code>boolean</code> | Enable access logging for the distribution.<br/>__*Default*__: false, unless `logBucket` is specified.
**enabled**? | <code>boolean</code> | Enable or disable the distribution.<br/>__*Default*__: true
**errorResponses**? | <code>Array<[aws_cloudfront.ErrorResponse](#aws-cdk-lib-aws-cloudfront-errorresponse)></code> | How CloudFront should handle requests that are not successful (e.g., PageNotFound).<br/>__*Default*__: No custom error responses.
**geoRestriction**? | <code>[aws_cloudfront.GeoRestriction](#aws-cdk-lib-aws-cloudfront-georestriction)</code> | Controls the countries in which your content is distributed.<br/>__*Default*__: No geographic restrictions
**httpVersion**? | <code>[aws_cloudfront.HttpVersion](#aws-cdk-lib-aws-cloudfront-httpversion)</code> | Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront.<br/>__*Default*__: HttpVersion.HTTP2
**logBucket**? | <code>[aws_s3.IBucket](#aws-cdk-lib-aws-s3-ibucket)</code> | The Amazon S3 bucket to store the access logs in.<br/>__*Default*__: A bucket is created if `enableLogging` is true
**logFilePrefix**? | <code>string</code> | An optional string that you want CloudFront to prefix to the access log filenames for this distribution.<br/>__*Default*__: no prefix
**logIncludesCookies**? | <code>boolean</code> | Specifies whether you want CloudFront to include cookies in access logs.<br/>__*Default*__: false
**minimumProtocolVersion**? | <code>[aws_cloudfront.SecurityPolicyProtocol](#aws-cdk-lib-aws-cloudfront-securitypolicyprotocol)</code> | The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.<br/>__*Default*__: SecurityPolicyProtocol.TLS_V1_2_2019
**priceClass**? | <code>[aws_cloudfront.PriceClass](#aws-cdk-lib-aws-cloudfront-priceclass)</code> | The price class that corresponds with the maximum price that you want to pay for CloudFront service.<br/>__*Default*__: PriceClass.PRICE_CLASS_ALL
**webAclId**? | <code>string</code> | Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.<br/>__*Default*__: No AWS Web Application Firewall web access control list (web ACL).



## struct FunctionProps  <a id="aws-cdk-image-resize-functionprops"></a>






Name | Type | Description 
-----|------|-------------
**allowAllOutbound**? | <code>boolean</code> | Whether to allow the Lambda to send all network traffic.<br/>__*Default*__: true
**allowPublicSubnet**? | <code>boolean</code> | Lambda Functions in a public subnet can NOT access the internet.<br/>__*Default*__: false
**architecture**? | <code>[aws_lambda.Architecture](#aws-cdk-lib-aws-lambda-architecture)</code> | The system architectures compatible with this lambda function.<br/>__*Default*__: Architecture.X86_64
**code**? | <code>[aws_lambda.Code](#aws-cdk-lib-aws-lambda-code)</code> | The source code of your Lambda function.<br/>__*Optional*__
**codeSigningConfig**? | <code>[aws_lambda.ICodeSigningConfig](#aws-cdk-lib-aws-lambda-icodesigningconfig)</code> | Code signing config associated with this function.<br/>__*Default*__: Not Sign the Code
**currentVersionOptions**? | <code>[aws_lambda.VersionOptions](#aws-cdk-lib-aws-lambda-versionoptions)</code> | Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method.<br/>__*Default*__: default options as described in `VersionOptions`
**deadLetterQueue**? | <code>[aws_sqs.IQueue](#aws-cdk-lib-aws-sqs-iqueue)</code> | The SQS queue to use if DLQ is enabled.<br/>__*Default*__: SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
**deadLetterQueueEnabled**? | <code>boolean</code> | Enabled DLQ.<br/>__*Default*__: false unless `deadLetterQueue` is set, which implies DLQ is enabled.
**deadLetterTopic**? | <code>[aws_sns.ITopic](#aws-cdk-lib-aws-sns-itopic)</code> | The SNS topic to use as a DLQ.<br/>__*Default*__: no SNS topic
**description**? | <code>string</code> | A description of the function.<br/>__*Default*__: No description.
**environment**? | <code>Map<string, string></code> | Key-value pairs that Lambda caches and makes available for your Lambda functions.<br/>__*Default*__: No environment variables.
**environmentEncryption**? | <code>[aws_kms.IKey](#aws-cdk-lib-aws-kms-ikey)</code> | The AWS KMS key that's used to encrypt your function's environment variables.<br/>__*Default*__: AWS Lambda creates and uses an AWS managed customer master key (CMK).
**ephemeralStorageSize**? | <code>[Size](#aws-cdk-lib-size)</code> | The size of the function’s /tmp directory in MiB.<br/>__*Default*__: 512 MiB
**events**? | <code>Array<[aws_lambda.IEventSource](#aws-cdk-lib-aws-lambda-ieventsource)></code> | Event sources for this function.<br/>__*Default*__: No event sources.
**filesystem**? | <code>[aws_lambda.FileSystem](#aws-cdk-lib-aws-lambda-filesystem)</code> | The filesystem configuration for the lambda function.<br/>__*Default*__: will not mount any filesystem
**functionName**? | <code>string</code> | A name for the function.<br/>__*Default*__: AWS CloudFormation generates a unique physical ID and uses that ID for the function's name. For more information, see Name Type.
**handler**? | <code>string</code> | The name of the method within your code that Lambda calls to execute your function.<br/>__*Optional*__
**initialPolicy**? | <code>Array<[aws_iam.PolicyStatement](#aws-cdk-lib-aws-iam-policystatement)></code> | Initial policy statements to add to the created Lambda Role.<br/>__*Default*__: No policy statements are added to the created Lambda role.
**insightsVersion**? | <code>[aws_lambda.LambdaInsightsVersion](#aws-cdk-lib-aws-lambda-lambdainsightsversion)</code> | Specify the version of CloudWatch Lambda insights to use for monitoring.<br/>__*Default*__: No Lambda Insights
**layers**? | <code>Array<[aws_lambda.ILayerVersion](#aws-cdk-lib-aws-lambda-ilayerversion)></code> | A list of layers to add to the function's execution environment.<br/>__*Default*__: No layers.
**logRetention**? | <code>[aws_logs.RetentionDays](#aws-cdk-lib-aws-logs-retentiondays)</code> | The number of days log events are kept in CloudWatch Logs.<br/>__*Default*__: logs.RetentionDays.INFINITE
**logRetentionRetryOptions**? | <code>[aws_lambda.LogRetentionRetryOptions](#aws-cdk-lib-aws-lambda-logretentionretryoptions)</code> | When log retention is specified, a custom resource attempts to create the CloudWatch log group.<br/>__*Default*__: Default AWS SDK retry options.
**logRetentionRole**? | <code>[aws_iam.IRole](#aws-cdk-lib-aws-iam-irole)</code> | The IAM role for the Lambda function associated with the custom resource that sets the retention policy.<br/>__*Default*__: A new role is created.
**maxEventAge**? | <code>[Duration](#aws-cdk-lib-duration)</code> | The maximum age of a request that Lambda sends to a function for processing.<br/>__*Default*__: Duration.hours(6)
**memorySize**? | <code>number</code> | The amount of memory, in MB, that is allocated to your Lambda function.<br/>__*Default*__: 128
**onFailure**? | <code>[aws_lambda.IDestination](#aws-cdk-lib-aws-lambda-idestination)</code> | The destination for failed invocations.<br/>__*Default*__: no destination
**onSuccess**? | <code>[aws_lambda.IDestination](#aws-cdk-lib-aws-lambda-idestination)</code> | The destination for successful invocations.<br/>__*Default*__: no destination
**profiling**? | <code>boolean</code> | Enable profiling.<br/>__*Default*__: No profiling.
**profilingGroup**? | <code>[aws_codeguruprofiler.IProfilingGroup](#aws-cdk-lib-aws-codeguruprofiler-iprofilinggroup)</code> | Profiling Group.<br/>__*Default*__: A new profiling group will be created if `profiling` is set.
**reservedConcurrentExecutions**? | <code>number</code> | The maximum of concurrent executions you want to reserve for the function.<br/>__*Default*__: No specific limit - account limit.
**retryAttempts**? | <code>number</code> | The maximum number of times to retry when the function returns an error.<br/>__*Default*__: 2
**role**? | <code>[aws_iam.IRole](#aws-cdk-lib-aws-iam-irole)</code> | Lambda execution role.<br/>__*Default*__: A unique role will be generated for this lambda function. Both supplied and generated roles can always be changed by calling `addToRolePolicy`.
**runtime**? | <code>[aws_lambda.Runtime](#aws-cdk-lib-aws-lambda-runtime)</code> | The runtime environment for the Lambda function that you are uploading.<br/>__*Optional*__
**securityGroups**? | <code>Array<[aws_ec2.ISecurityGroup](#aws-cdk-lib-aws-ec2-isecuritygroup)></code> | The list of security groups to associate with the Lambda's network interfaces.<br/>__*Default*__: If the function is placed within a VPC and a security group is not specified, either by this or securityGroup prop, a dedicated security group will be created for this function.
**timeout**? | <code>[Duration](#aws-cdk-lib-duration)</code> | The function execution time (in seconds) after which Lambda terminates the function.<br/>__*Default*__: Duration.seconds(3)
**tracing**? | <code>[aws_lambda.Tracing](#aws-cdk-lib-aws-lambda-tracing)</code> | Enable AWS X-Ray Tracing for Lambda Function.<br/>__*Default*__: Tracing.Disabled
**vpc**? | <code>[aws_ec2.IVpc](#aws-cdk-lib-aws-ec2-ivpc)</code> | VPC network to place Lambda network interfaces.<br/>__*Default*__: Function is not placed within a VPC.
**vpcSubnets**? | <code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code> | Where to place the network interfaces within the VPC.<br/>__*Default*__: the Vpc default strategy if not specified



## interface IImageResizeProps  <a id="aws-cdk-image-resize-iimageresizeprops"></a>




### Properties


Name | Type | Description 
-----|------|-------------
**cloudfrontDistributionProps**? | <code>[DistributionProps](#aws-cdk-image-resize-distributionprops)</code> | __*Optional*__
**originResponseLambdaProps**? | <code>[aws_lambda_nodejs.NodejsFunctionProps](#aws-cdk-lib-aws-lambda-nodejs-nodejsfunctionprops)</code> | __*Optional*__
**s3BucketProps**? | <code>[aws_s3.BucketProps](#aws-cdk-lib-aws-s3-bucketprops)</code> | __*Optional*__
**viewerRequestLambdaProps**? | <code>[FunctionProps](#aws-cdk-image-resize-functionprops)</code> | __*Optional*__



