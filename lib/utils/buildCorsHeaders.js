/* @flow */

import type { RunnerRuntimeConfig } from '../types/runner';

const buildCORSHeaders = (config: RunnerRuntimeConfig): { [headerName: string]: string } => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
  'Access-Control-Allow-Headers': Object.keys(config.response.headers).reduce((p, c) => {
    p += `,${c}`;
    return p;
  }, 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'),
});

export default buildCORSHeaders;
