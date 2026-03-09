import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../constants';

export const BARCODE_NOT_UNIQUE_MESSAGE = 'Barcode must be unique';
const PO_LINE_NUMBER_LENGTH_LIMIT = 26;

const isBarcodeUnique = (message) => {
  return message?.includes(BARCODE_NOT_UNIQUE_MESSAGE);
};

// The `ResponseErrorsContainer` handler accepts a strategy instance that implements the `handle` method.
const strategyAdapter = (handle) => ({ handle });

/* Error handle strategies */
const defaultErrorCodeBasedStrategy = ({ sendCallout, values }) => {
  return strategyAdapter((container) => {
    sendCallout({
      messageId: `ui-receiving.errors.${container.getError().code}`,
      type: 'error',
      values,
    });
  });
};

const polNumberInvalidOrTooLongStrategy = ({ sendCallout }) => {
  return defaultErrorCodeBasedStrategy({
    sendCallout,
    values: { count: PO_LINE_NUMBER_LENGTH_LIMIT },
  });
};

const missingLoanTypeStrategy = ({ sendCallout }) => {
  return strategyAdapter(() => {
    sendCallout({
      messageId: 'ui-receiving.title.actions.missingLoanTypeId.error',
      type: 'error',
    });
  });
};

const instanceNotFoundStrategy = ({ sendCallout }) => {
  return strategyAdapter(() => {
    sendCallout({
      messageId: 'ui-receiving.errors.instanceId',
      type: 'error',
    });
  });
};

const barcodeIsNotUniqueStrategy = ({ sendCallout }) => {
  return strategyAdapter(() => {
    sendCallout({
      messageId: 'ui-receiving.errors.barcodeIsNotUnique',
      type: 'error',
    });
  });
};

// Error handling strategy chain - matches errors against predefined conditions
// and applies the first matching strategy. Order matters as strategies are
// evaluated sequentially.
const STRATEGY_MATCHERS = [
  {
    select: (handler) => handler.getError().code === ERROR_CODES.polNumberInvalidOrTooLong,
    strategy: polNumberInvalidOrTooLongStrategy,
  },
  {
    select: (handler) => handler.getError().code in ERROR_CODES,
    strategy: defaultErrorCodeBasedStrategy,
  },
  // Any errors, including errors in the specified parameters or message.
  // Combining strategies into one to maintain existing behavior.
  {
    select: (handler) => {
      const TARGET_PARAMETERS_SET = new Set(['permanentLoanTypeId', 'instanceId']);
      const errors = handler.errors;

      return errors.some((error) => (
        new Set(error.getParameters().keys()).intersection(TARGET_PARAMETERS_SET).size
        || isBarcodeUnique(error.message)
      ));
    },
    strategy: ({ sendCallout }) => {
      return strategyAdapter((container) => {
        const errorsMap = container.getErrors();

        errorsMap.forEach((error) => {
          const parameters = error.getParameters();

          if (parameters.has('permanentLoanTypeId')) {
            missingLoanTypeStrategy({ sendCallout }).handle(container);
          }

          if (parameters.has('instanceId')) {
            instanceNotFoundStrategy({ sendCallout }).handle(container);
          }

          if (isBarcodeUnique(error.message)) {
            barcodeIsNotUniqueStrategy({ sendCallout }).handle(container);
          }
        });
      });
    },
  },
];
/* ----- */

export async function handleCommonErrors(sendCallout, response) {
  let hasCommonErrors = false;

  const { handler } = await ResponseErrorsContainer.create(response);
  const strategy = STRATEGY_MATCHERS.find(({ select }) => select(handler))?.strategy;

  if (strategy) {
    handler.handle(strategy({ sendCallout }));
    hasCommonErrors = true;
  }

  return hasCommonErrors;
}
