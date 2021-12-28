export default {
  webpack(config) {
    config.experiments = {
      syncWebAssembly: true,
    }

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/sync',
    })

    return config
  },
}
