import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import {
  PIECES_API,
  RECEIVE_API,
} from '../../../../src/common/constants';

const SCHEMA_NAME = 'pieces';

export const configPieces = server => {
  server.get(`${PIECES_API}`, createGetAll(SCHEMA_NAME));
  server.post(RECEIVE_API, (schema, request) => {
    const body = JSON.stringify(request.requestBody);

    return {
      receivingResults: [{
        poLineId: body.poLineId,
        processedSuccessfully: 1,
        processedWithError: 0,
        receivingItemResults: [{
          pieceId: body.pieceId,
          processingStatus: {
            type: 'success',
          },
        }],
      }],
      totalRecords: 1,
    };
  });
};
