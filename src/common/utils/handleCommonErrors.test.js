import { ERROR_CODES } from '../constants';
import {
  BARCODE_NOT_UNIQUE_MESSAGE,
  handleCommonErrors,
} from './handleCommonErrors';

describe('handleCommonErrors', () => {
  let showCallout;

  beforeEach(() => {
    showCallout = jest.fn();
  });

  it('should call showCallout with receivingProcessEncumbrancesError error', async () => {
    const response = { errors: [{ code: ERROR_CODES.receivingProcessEncumbrancesError }] };

    await handleCommonErrors(showCallout, response);

    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.errors.receivingProcessEncumbrancesError',
      'type': 'error',
    });
  });

  it('should call showCallout with barcodeMustBeUniquer error', async () => {
    const response = { errors: [{ message: BARCODE_NOT_UNIQUE_MESSAGE }] };

    await handleCommonErrors(showCallout, response);

    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.errors.barcodeMustBeUnique',
      'type': 'error',
    });
  });

  it('should not call showCallout and return false', async () => {
    const response = { errors: [{ code: '' }] };
    const result = await handleCommonErrors(showCallout, response);

    expect(result).toBeFalsy();
  });
});
