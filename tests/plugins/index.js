/* @flow */
import { data, context, callback } from '../mock';
import handler from './handler';

console.log('Calling Handler');

handler(data.proxy, context.simple, callback);
