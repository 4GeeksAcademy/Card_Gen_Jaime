const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

const DEFAULT_EXTENSIONS = prettier.getSupportInfo
  ? prettier
      .getSupportInfo()
      .languages.map(l => l.extensions)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  : [
      ".css",
      ".graphql",
      ".js",
      ".json",
      ".jsx",
      ".less",
      ".sass",
      ".scss",
      ".ts",
      ".tsx",
      ".vue",
      ".yaml",
    ];

const DEFAULT_ENCODING = "utf-8";

const DEFAULT_CONFIG_FILE = `${process.cwd()}/.prettierrc`;

module.exports = class PrettierPlugin {
  constructor(options) {
    options = options || {};

    // Encoding to use when reading / writing files
    this.encoding = options.encoding || DEFAULT_ENCODING;
    delete options.encoding;

    // Only process these files
    this.extensions = options.extensions || DEFAULT_EXTENSIONS;
    delete options.extensions;

    // Utilize this config file for options
    this.configFile = options.configFile || DEFAULT_CONFIG_FILE;
    delete options.configFile;
    
    // Resolve the config options from file to an object
    const configOptions = prettier.resolveConfig.sync(this.configFile) || {};
    
    // Override Prettier options from config if any are specified
    this.prettierOptions = Object.assign(configOptions, options);
    
    // Fail silently
    this.failSilently = options.failSilently || false;
    delete options.failSilently;
}

apply(compiler) {
    compiler.hooks.emit.tapAsync('Prettier', (compilation, callback) => {
        const promises = [];
      compilation.fileDependencies.forEach(filepath => {
        if (this.extensions.indexOf(path.extname(filepath)) === -1) {
          return;
        }
  
        if (/node_modules/.exec(filepath)) {
          return;
        }
        promises.push(new Promise((resolve, reject) => {
          fs.readFile(filepath, this.encoding, (err, source) => {
            if (err) {
                return reject(err);
            }
            
            try{ 
                resolve();
            }
            catch(err){
                if(this.failSilently) resolve();
                else return reject(err);
            }
          });
        }));
      });
  
      Promise.all(promises).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    });
  }
};
