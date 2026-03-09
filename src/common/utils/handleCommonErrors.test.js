import { ERROR_CODES } from '../constants';
import {
  BARCODE_NOT_UNIQUE_MESSAGE,
  handleCommonErrors,
  PO_LINE_NUMBER_LENGTH_LIMIT,
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

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should handle invalid POL number error', async () => {
    const response = getErrorResponseMock({ code: ERROR_CODES.polNumberInvalidOrTooLong });
    const result = await handleCommonErrors(showCallout, response);

    expect(result).toBeTruthy();
    expect(showCallout).toHaveBeenCalledWith({
      messageId: `ui-receiving.errors.${ERROR_CODES.polNumberInvalidOrTooLong}`,
      type: 'error',
      values: { count: PO_LINE_NUMBER_LENGTH_LIMIT },
    });
  });

  it('should handle errors for specified parameters and message', async () => {
    const response = getErrorResponseMock(
      { message: BARCODE_NOT_UNIQUE_MESSAGE },
      { code: 'test1', parameters: [{ key: 'permanentLoanTypeId' }] },
      { code: 'test2', parameters: [{ key: 'instanceId' }] },
    );

    const result = await handleCommonErrors(showCallout, response);

    expect(result).toBeTruthy();
    expect(showCallout).toHaveBeenNthCalledWith(1, expect.objectContaining({ messageId: 'ui-receiving.errors.barcodeIsNotUnique' }));
    expect(showCallout).toHaveBeenNthCalledWith(2, expect.objectContaining({ messageId: 'ui-receiving.title.actions.missingLoanTypeId.error' }));
    expect(showCallout).toHaveBeenNthCalledWith(3, expect.objectContaining({ messageId: 'ui-receiving.errors.instanceId' }));
  });
});
