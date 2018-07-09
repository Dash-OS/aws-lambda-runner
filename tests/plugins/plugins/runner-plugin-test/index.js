/* @flow */

import Plugin from '../../../../lib/plugin';

type PluginSettings = {|
  foo: 'bar',
|};

const getPluginSettings = (settings: $Shape<PluginSettings>): PluginSettings => ({
  foo: settings.foo || 'bar',
});

class RunnerPluginTest extends Plugin<PluginSettings> {
  settings: PluginSettings;

  constructor(settings?: $Shape<PluginSettings> = {}) {
    super(settings);
    this.settings = getPluginSettings(settings);
  }

  onExecute = () => console.log('EXECUTING!');

  onComplete = () => console.log('COMPLETE!');

  onError = () => console.error('ERROR!');
}

export default RunnerPluginTest;
