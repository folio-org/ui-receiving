import { ERROR_CODES } from '../constants';
import {
  BARCODE_NOT_UNIQUE_MESSAGE,
  handleCommonErrors,
} from './handleCommonErrors';

const getErrorResponseMock = (...errors) => {
  const errorBody = {
    errors: [...errors],
    total_records: errors.length,
  };

  const errorResponse = {
    clone: jest.fn().mockReturnThis(),
    json: jest.fn().mockResolvedValue(errorBody),
  };

  return errorResponse;
};

describe('handleCommonErrors', () => {
  let showCallout;

  beforeEach(() => {
    showCallout = jest.fn();
  });

  it('should call showCallout with receivingProcessEncumbrancesError error', async () => {
    const response = getErrorResponseMock({ code: ERROR_CODES.receivingProcessEncumbrancesError });

    await handleCommonErrors(showCallout, response);

    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.errors.receivingProcessEncumbrancesError',
      'type': 'error',
    });
  });

  it('should call showCallout with barcodeMustBeUniquer error', async () => {
    const response = getErrorResponseMock({ message: BARCODE_NOT_UNIQUE_MESSAGE });

    await handleCommonErrors(showCallout, response);

    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.errors.barcodeIsNotUnique',
      'type': 'error',
    });
  });

  it('should not call showCallout and return false', async () => {
    const response = getErrorResponseMock({ code: '' });
    const result = await handleCommonErrors(showCallout, response);

    expect(result).toBeFalsy();
  });
});
