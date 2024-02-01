import { ERROR_CODES } from '../constants';

export const BARCODE_NOT_UNIQUE_MESSAGE = 'Barcode must be unique';

const isBarcodeUnique = (message) => {
  return message?.includes(BARCODE_NOT_UNIQUE_MESSAGE);
};

export async function handleCommonErrors(showCallout, response) {
  let parsed = response;
  let hasCommonErrors = false;

  try {
    parsed = await response.json();
  // eslint-disable-next-line no-empty
  } catch (parsingException) {
  }

  if (parsed?.errors?.length) {
    if (parsed.errors[0]?.code in ERROR_CODES) {
      showCallout({
        messageId: `ui-receiving.errors.${parsed.errors[0].code}`,
        type: 'error',
      });
      hasCommonErrors = true;
    } else {
      parsed.errors.forEach(({ parameters, message }) => {
        if (parameters?.some(({ key }) => key === 'permanentLoanTypeId')) {
          showCallout({
            messageId: 'ui-receiving.title.actions.missingLoanTypeId.error',
            type: 'error',
          });
          hasCommonErrors = true;
        }
        if (parameters?.some(({ key }) => key === 'instanceId')) {
          showCallout({
            messageId: 'ui-receiving.errors.instanceId',
            type: 'error',
          });
          hasCommonErrors = true;
        }
        if (isBarcodeUnique(message)) {
          showCallout({
            messageId: 'ui-receiving.errors.barcodeMustBeUnique',
            type: 'error',
          });
          hasCommonErrors = true;
        }
      });
    }
  }

  return hasCommonErrors;
}
