import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import Ep25 = require('../lib/ep25-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Ep25.Ep25Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
