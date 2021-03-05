/**
 * @jest-environment node
 */
import path from 'path';
import vm from 'vm';
import { IFs } from 'memfs';
import compile from './util/compile';

test('transform less', async () => {
  const { stats, compiler } = await compile();

  const name = stats.toJson().assets[0].name; 
  const code = (compiler.outputFileSystem as IFs).readFileSync(
    path.join(stats.compilation.outputOptions.path, name)
  ).toString();

  const result = vm.runInNewContext(
    `${code};module.exports = customLoaderExport;`,
    {
      module: {},
    }
  );

  expect(result.default.css).toMatchSnapshot('css');
});
