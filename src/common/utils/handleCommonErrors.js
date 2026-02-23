import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../constants';

export const BARCODE_NOT_UNIQUE_MESSAGE = 'Barcode must be unique';

const isBarcodeUnique = (message) => {
  return message?.includes(BARCODE_NOT_UNIQUE_MESSAGE);
};

export async function handleCommonErrors(showCallout, response) {
  const { handler } = await ResponseErrorsContainer.create(response);

  let hasCommonErrors = false;
  const errorsMap = handler.getErrors();

  if (errorsMap.size) {
    const code = handler.getError().code;

    if (code in ERROR_CODES) {
      showCallout({
        messageId: `ui-receiving.errors.${code}`,
        type: 'error',
      });
      hasCommonErrors = true;

      return hasCommonErrors;
    }

    errorsMap.forEach((error) => {
      const parameters = error.getParameters();

      if (parameters.has('permanentLoanTypeId')) {
        showCallout({
          messageId: 'ui-receiving.title.actions.missingLoanTypeId.error',
          type: 'error',
        });
        hasCommonErrors = true;
      }

      if (parameters.has('instanceId')) {
        showCallout({
          messageId: 'ui-receiving.errors.instanceId',
          type: 'error',
        });
        hasCommonErrors = true;
      }

      if (isBarcodeUnique(error.message)) {
        showCallout({
          messageId: 'ui-receiving.errors.barcodeIsNotUnique',
          type: 'error',
        });
        hasCommonErrors = true;
      }
    });
  }

  return hasCommonErrors;
}
