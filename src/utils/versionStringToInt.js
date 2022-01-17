const versionStringToInt = (version) => {
  if (!version) return null;

  const segments = version.split('.');

  const reduced = segments.reduce((acc, ver) => {
    const verInt = parseInt(ver);
    if (Number.isInteger(verInt)) {
      return acc + verInt;
    }
    return parseInt(acc);
  });

  return reduced;
};

module.exports = { versionStringToInt };
