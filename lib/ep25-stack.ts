import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as efs from '@aws-cdk/aws-efs';
import * as apig from '@aws-cdk/aws-apigatewayv2';
import {Vpc} from '@aws-cdk/aws-ec2';


export class Ep25Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'Vpc', {isDefault:true});

    const fs = new efs.FileSystem(this, 'Filesystem', {vpc});

    const accessPoint = fs.addAccessPoint('ap', {
      path: 'export/lambda',
      createAcl: {
        ownerGid:'1001',
        ownerUid:'1001',
        permissions :'750',
      },
      posixUser:{
        gid:'1001',
        uid:'1001',
      }
    })
    const fn = new.lambda.Function(this, 'Func' , {
      runtime: lambda.Runtime.PYTHON_3_7,
      timeout : cdk.Duration.seconds(60),
      code: new lambda.InlineCode(
import json
import os
import string
import random
import datetime
MSG_FILE_PATH = '/mnt/msg/content'
def randomString(stringLength=10):
        letters = string.ascii_lowercase
        return ''.join(random.choice(letters) for i in range(stringLength))
def lambda_handler(event, context):
        with open(MSG_FILE_PATH, 'a') as f:
            f.write(f " {datetime.datetime.utcnow():%Y-%m-%d-%H:%M:%S} " + randomString(5) + ' ')
        file = open(MSG_FILE_PATH, "r")
        file_content = file.read()
        file.close()
        return{
          'statusCode' : 200,
          'body':str(file_content)
        }
         ),
        handler:'index.lambda_handler',
        vpc,
        filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/msg')
    })


        const api = new apig.HttpApi(this, 'Api', {
          defaultIntegration: new apig.LambdaProxyIntegration({
            handler: fn,

          })
        })

        new cdk.CfnOutput(this, 'URL', { value: api:url!})


        }
}
