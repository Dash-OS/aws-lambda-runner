/* @flow */

type Schema = {
  +methods: $ReadOnlyArray<'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'>,
};

const schema: Schema = {
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
};

export default schema;
