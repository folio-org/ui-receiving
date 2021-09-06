import { ERROR_CODES } from '../constants';
import { handleCommonErrors } from './handleCommonErrors';

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

  it('should not call showCallout and return false', async () => {
    const response = { errors: [{ code: '' }] };
    const result = await handleCommonErrors(showCallout, response);

    expect(result).toBeFalsy();
  });
});
