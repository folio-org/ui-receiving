import { handleReceiveErrorResponse } from './handleReceiveErrorResponse';

describe('test handleReceiveErrorResponse', () => {
  let showCallout;

  beforeEach(() => {
    showCallout = jest.fn();
  });

  it('should call showCallout with receiving error', async () => {
    const response = { errorPieces: [{ enumeration: 'enumeration', processingStatus: { error: { code: 'code' } } }] };

    await handleReceiveErrorResponse(showCallout, response);
    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.errors.code',
      'type': 'error',
      'values': {
        'enumeration': 'enumeration',
      },
    });
  });

  it('should call showCallout with unknown error', async () => {
    const response = { errors: [{ parameters: [{ key: 'key' }] }] };
    const result = await handleReceiveErrorResponse(showCallout, response);

    expect(result).toBeFalsy();
    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.title.actions.receive.error',
      'type': 'error',
    });
  });

  it('should call showCallout with common error', async () => {
    const response = { errors: [{ parameters: [{ key: 'instanceId' }] }] };
    const result = await handleReceiveErrorResponse(showCallout, response);

    expect(result).toBeFalsy();
    expect(showCallout).toHaveBeenCalledWith({
      'messageId': 'ui-receiving.errors.instanceId',
      'type': 'error',
    });
  });
});
