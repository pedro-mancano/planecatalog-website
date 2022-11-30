class PrecacheGenerator {
  constructor(options) {
    this.defaultOptions = {
      onBuildStart: [],
      onBuildEnd: [],
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync('WebpackShellPlugin', (compilation, callback) => {
      //TODO
      callback();
    });

  }
}

module.exports = PrecacheGenerator;