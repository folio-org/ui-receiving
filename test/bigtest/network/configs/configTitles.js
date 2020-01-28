import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { TITLES_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'titles';

export const configTitles = server => {
  server.get(`${TITLES_API}`, createGetAll(SCHEMA_NAME));
  server.get(`${TITLES_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(`${TITLES_API}`, createPost(SCHEMA_NAME));
  server.put(`${TITLES_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${TITLES_API}/:id`, SCHEMA_NAME);
};
