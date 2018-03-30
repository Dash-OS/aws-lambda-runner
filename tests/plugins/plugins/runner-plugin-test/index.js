/* @flow */

import Plugin from '../../../../lib/plugin';

type PluginSettings = {|
  foo: 'bar'
|};

class RunnerPluginTest extends Plugin<PluginSettings> {
  settings: PluginSettings;

  constructor(settings: PluginSettings) {
    super(settings);
    console.log('Plugin Constructed with Settings: ', settings);
    this.settings = settings;
  }

  onExecute = () => console.log('EXECUTING!');

  onComplete = () => console.log('COMPLETE!');

  onError = () => console.error('ERROR!');
}

export default RunnerPluginTest;
