import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { ITEMS_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'items';

export const configItems = server => {
  server.get(`${ITEMS_API}`, createGetAll(SCHEMA_NAME));
};
