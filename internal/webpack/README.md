# Webpack Setup

The project utilizes Webpack 4 to provide quick bundling, tree-shaking, dead code elimination, and general tooling. Webpack 4 does many default settings which makes the entire bundling experience significantly simpler.

## Component Resolve

Component Resolving is active. This allows importing of a file by the same name of the folder rather than only using `index.js`. If all else fails it will still load `index.js` as expected.

So if we had `../foo/bar` and `bar` is a folder. If there were a file `bar.js` within that folder it would be loaded by the resolver plugin.

## Babel Transpiling

Utilizes Environment detection to provide only the necessary polyfills. Modifies LoDash pacakges so it only imports the necessary functions (the one you actually call).
