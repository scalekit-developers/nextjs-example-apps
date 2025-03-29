import { Scalekit } from '@scalekit-sdk/node';

const scalekit = new Scalekit(
  'https://scalekit-z44iroqaaada-dev.scalekit.cloud',
  'skc_58327482062864390',
  'test_5X2eJNvwWVqeIRBhMJ7txSk5xHyPtfASynGfT35HdsmAQspfAQzkWbnsDgjiItN6'
);

const organizations = await scalekit.organization.listOrganization({
  pageSize: 10,
});

console.log(organizations);
