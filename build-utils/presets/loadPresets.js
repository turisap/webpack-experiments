const WebpackMerge = require('webpack-merge');

const applyPresets = (env) => {
    const { presets } = env;
    const mergePresets = [].concat(...[presets]);
    const mergedConfigs = mergePresets.map(presetName => require(`./presets/webpack.${presetName}`)(env));

    return WebpackMerge({}, ...mergedConfigs);
}

module.exports = applyPresets;