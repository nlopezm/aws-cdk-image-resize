import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import {
  AddBehaviorOptions,
  BehaviorOptions,
  ErrorResponse,
  GeoRestriction,
  HttpVersion,
  PriceClass,
  SecurityPolicyProtocol,
} from 'aws-cdk-lib/aws-cloudfront';
import { Code, FunctionOptions, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

/**
 * Unfortunately, we can't use Partial<DistributionProps> because JSII breaks
 * Following interfaces are a copy+paste from aws libraries :(
 * making all of its props optional
 */

/**
 * Properties for a Distribution.
 *
 * @stability stable
 */
export interface DistributionProps {
  /**
   * The default behavior for the distribution.
   *
   * @stability stable
   */
  readonly defaultBehavior?: AddBehaviorOptions;
  /**
   * Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.
   *
   * @default - no additional behaviors are added.
   * @stability stable
   */
  readonly additionalBehaviors?: Record<string, BehaviorOptions>;
  /**
   * A certificate to associate with the distribution.
   *
   * The certificate must be located in N. Virginia (us-east-1).
   *
   * @default - the CloudFront wildcard certificate (*.cloudfront.net) will be used.
   * @stability stable
   */
  readonly certificate?: acm.ICertificate;
  /**
   * Any comments you want to include about the distribution.
   *
   * @default - no comment
   * @stability stable
   */
  readonly comment?: string;
  /**
   * The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution. If no default object is set, the request goes to the origin's root (e.g., example.com/).
   *
   * @default - no default root object
   * @stability stable
   */
  readonly defaultRootObject?: string;
  /**
   * Alternative domain names for this distribution.
   *
   * If you want to use your own domain name, such as www.example.com, instead of the cloudfront.net domain name,
   * you can add an alternate domain name to your distribution. If you attach a certificate to the distribution,
   * you must add (at least one of) the domain names of the certificate to this list.
   *
   * @default - The distribution will only support the default generated name (e.g., d111111abcdef8.cloudfront.net)
   * @stability stable
   */
  readonly domainNames?: string[];
  /**
   * Enable or disable the distribution.
   *
   * @default true
   * @stability stable
   */
  readonly enabled?: boolean;
  /**
   * Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address.
   *
   * If you specify false, CloudFront responds to IPv6 DNS requests with the DNS response code NOERROR and with no IP addresses.
   * This allows viewers to submit a second request, for an IPv4 address for your distribution.
   *
   * @default true
   * @stability stable
   */
  readonly enableIpv6?: boolean;
  /**
   * Enable access logging for the distribution.
   *
   * @default - false, unless `logBucket` is specified.
   * @stability stable
   */
  readonly enableLogging?: boolean;
  /**
   * Controls the countries in which your content is distributed.
   *
   * @default - No geographic restrictions
   * @stability stable
   */
  readonly geoRestriction?: GeoRestriction;
  /**
   * Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront.
   *
   * For viewers and CloudFront to use HTTP/2, viewers must support TLS 1.2 or later, and must support server name identification (SNI).
   *
   * @default HttpVersion.HTTP2
   * @stability stable
   */
  readonly httpVersion?: HttpVersion;
  /**
   * The Amazon S3 bucket to store the access logs in.
   *
   * @default - A bucket is created if `enableLogging` is true
   * @stability stable
   */
  readonly logBucket?: s3.IBucket;
  /**
   * Specifies whether you want CloudFront to include cookies in access logs.
   *
   * @default false
   * @stability stable
   */
  readonly logIncludesCookies?: boolean;
  /**
   * An optional string that you want CloudFront to prefix to the access log filenames for this distribution.
   *
   * @default - no prefix
   * @stability stable
   */
  readonly logFilePrefix?: string;
  /**
   * The price class that corresponds with the maximum price that you want to pay for CloudFront service.
   *
   * If you specify PriceClass_All, CloudFront responds to requests for your objects from all CloudFront edge locations.
   * If you specify a price class other than PriceClass_All, CloudFront serves your objects from the CloudFront edge location
   * that has the lowest latency among the edge locations in your price class.
   *
   * @default PriceClass.PRICE_CLASS_ALL
   * @stability stable
   */
  readonly priceClass?: PriceClass;
  /**
   * Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.
   *
   * To specify a web ACL created using the latest version of AWS WAF, use the ACL ARN, for example
   * `arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a`.
   * To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a`.
   *
   * @default - No AWS Web Application Firewall web access control list (web ACL).
   * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistribution.html#API_CreateDistribution_RequestParameters.
   * @stability stable
   */
  readonly webAclId?: string;
  /**
   * How CloudFront should handle requests that are not successful (e.g., PageNotFound).
   *
   * @default - No custom error responses.
   * @stability stable
   */
  readonly errorResponses?: ErrorResponse[];
  /**
   * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
   *
   * CloudFront serves your objects only to browsers or devices that support at
   * least the SSL version that you specify.
   *
   * @default SecurityPolicyProtocol.TLS_V1_2_2019
   * @stability stable
   */
  readonly minimumProtocolVersion?: SecurityPolicyProtocol;
}

/**
 * @stability stable
 */
export interface FunctionProps extends FunctionOptions {
  /**
   * The runtime environment for the Lambda function that you are uploading.
   *
   * For valid values, see the Runtime property in the AWS Lambda Developer
   * Guide.
   *
   * Use `Runtime.FROM_IMAGE` when when defining a function from a Docker image.
   *
   * @stability stable
   */
  readonly runtime?: Runtime;
  /**
   * The source code of your Lambda function.
   *
   * You can point to a file in an
   * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
   * code as inline text.
   *
   * @stability stable
   */
  readonly code?: Code;
  /**
   * The name of the method within your code that Lambda calls to execute your function.
   *
   * The format includes the file name. It can also include
   * namespaces and other qualifiers, depending on the runtime.
   * For more information, see https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-features.html#gettingstarted-features-programmingmodel.
   *
   * Use `Handler.FROM_IMAGE` when defining a function from a Docker image.
   *
   * NOTE: If you specify your source code as inline text by specifying the
   * ZipFile property within the Code property, specify index.function_name as
   * the handler.
   *
   * @stability stable
   */
  readonly handler?: string;
}
