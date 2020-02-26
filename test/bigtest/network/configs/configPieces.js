import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import {
  PIECES_API,
} from '../../../../src/common/constants';

const SCHEMA_NAME = 'pieces';

export const configPieces = server => {
  server.get(`${PIECES_API}`, createGetAll(SCHEMA_NAME));
};
