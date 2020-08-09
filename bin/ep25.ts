#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Ep25Stack } from '../lib/ep25-stack';

const app = new cdk.App();

const env = {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
}


new Ep25Stack(app, 'Ep25Stack',{ env });
