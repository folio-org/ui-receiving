import {
  CHECKIN_API,
  RECEIVE_API,
} from '../../../../src/common/constants';

export const configTitleReceive = server => {
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

  server.post(CHECKIN_API, (schema, request) => {
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
