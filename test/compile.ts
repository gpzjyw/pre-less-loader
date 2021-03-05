import path from 'path';
import webpack, { Stats, Compiler } from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

function compile(): Promise<{ 
  stats: Stats, 
  compiler: Compiler
}> {
  const compiler = webpack({
    context: __dirname,
    mode: "development",
    entry: '../mockData/variables.less',
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
      library: "customLoaderExport",
    },
    module: {
      rules: [
        {
          test: /variables\.less$/,
          use: [
            path.resolve(__dirname, './testLoader.js'),
            {
              loader: path.resolve(__dirname, '../src/index.js'),
            },
          ]
        }
      ]
    }
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume);
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.hasErrors()) {
        reject(stats.toJson().errors);
      }
      resolve({ stats, compiler });
    })
  })
}

export default compile;
