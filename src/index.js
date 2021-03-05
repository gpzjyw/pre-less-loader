const enableReg = /\/\*{1,2}\s*autoLessVariableExport\s*\*{1,2}\//;
const matchVarReg = /@[a-zA-Z0-9_-]+\s*:/g;
const matchSpaceReg = /\s*:/;
const mathcCharReg = /-[a-zA-Z0-9_]/g;

function customLessLoader(source) {
  if (!source || !source.match(enableReg)) {
    return source;
  }
  const callback = this.async();

  const varsArr = source.match(matchVarReg);

  const exportVars = varsArr ? varsArr.map(item => item.replace(matchSpaceReg, '')) : [];

  let exportVarStr = '';

  exportVars.forEach((lessVarName) => {
    const jsVarName = lessVarName.replace(/^@/, '')
      .replace(mathcCharReg, 
        (str) => str[1].toUpperCase().concat(str.slice(2)));
    exportVarStr += `${jsVarName}: ${lessVarName};\n`;
  });

  callback(
    null,
    exportVarStr ? `
      ${source}
      :export {
        ${exportVarStr}
      };
    ` : source
  );
}

module.exports = customLessLoader;
