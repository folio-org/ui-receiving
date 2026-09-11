const path = require('node:path');
const { config: stripesConfig } = require('@folio/jest-config-stripes');
const acqConfig = require('@folio/stripes-acq-components/jest.config');

const transformIgnorePatterns = stripesConfig.transformIgnorePatterns.map((pattern) => pattern.replace('(?!', '(?!@k-int/stripes-kint-components|'));

module.exports = {
  ...stripesConfig,
  setupFiles: [
    ...stripesConfig.setupFiles,
    ...acqConfig.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  transformIgnorePatterns,
};
