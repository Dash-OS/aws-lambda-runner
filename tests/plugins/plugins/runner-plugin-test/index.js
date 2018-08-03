/* @flow */

import Plugin from '../../../../lib/plugin';

type PluginSettings = {|
  stateID: 'test' | string,
  foo: 'bar',
|};

// when a plugin will provide values for the executing
// function, it provides a "state" object so that we can
// provide type safety to the user
type PluginState = {|
  active: boolean,
|};

const getPluginSettings = (settings: PluginSettings): PluginSettings => ({
  stateID: settings.stateID || 'test',
  foo: settings.foo || 'bar',
});

class RunnerPluginTest extends Plugin<PluginSettings, PluginState> {
  stateID: $PropertyType<PluginSettings, 'stateID'>;
  settings: PluginSettings;
  state: PluginState;

  constructor(settings?: $Shape<PluginSettings> = {}) {
    super(settings);
    this.settings = getPluginSettings(settings);
    this.stateID = this.settings.stateID;
    this.state = {
      active: true,
    };
  }

  onExecute = (data, config) => {
    this.state = {
      active: false,
    };
    config.state[this.stateID] = this.state;
  };

  onComplete = () => console.log('COMPLETE!');

  onError = () => console.error('ERROR!');
}

export default RunnerPluginTest;
