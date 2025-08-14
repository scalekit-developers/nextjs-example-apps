import { Scalekit } from '@scalekit-sdk/node';

const environmentUrl = process.env.SCALEKIT_ENVIRONMENT_URL || '';
const clientId = process.env.SCALEKIT_CLIENT_ID || '';
const clientSecret = process.env.SCALEKIT_CLIENT_SECRET || '';

const scalekit = new Scalekit(environmentUrl, clientId, clientSecret);

export default scalekit;
