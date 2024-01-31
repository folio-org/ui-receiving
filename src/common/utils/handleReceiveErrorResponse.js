import { handleCommonErrors } from './handleCommonErrors';

const DEFAULT_RECEIVE_ERROR = 'ui-receiving.title.actions.receive.error';
const DEFAULT_UNRECEIVE_ERROR = 'ui-receiving.title.actions.unreceive.error';

export async function handleReceiveErrorResponse(showCallout, response, defaultError = DEFAULT_RECEIVE_ERROR) {
  let parsed;

  try {
    parsed = await response.json();
  } catch (parsingException) {
    parsed = response;
  }

  const hasCommonErrors = await handleCommonErrors(showCallout, parsed);

  if (hasCommonErrors) {
    return;
  }

  if (parsed?.errorPieces?.length) {
    parsed.errorPieces.forEach(({ enumeration, processingStatus }) => {
      showCallout({
        messageId: `ui-receiving.errors.${processingStatus.error.code}`,
        type: 'error',
        values: { enumeration },
      });
    });

    return;
  }

  showCallout({ messageId: defaultError, type: 'error' });
}

export const handleUnrecieveErrorResponse = async ({
  error,
  receivedItems = [],
  showCallout,
  defaultError = DEFAULT_UNRECEIVE_ERROR,
}) => {
  const errorPieces = error.filter(({ processedWithError }) => processedWithError > 0).reduce(
    (acc, { receivingItemResults }) => {
      const errorResults = receivingItemResults
        .filter(({ processingStatus }) => processingStatus.type === 'failure')
        .map((d) => ({
          ...d,
          enumeration: receivedItems.find(({ id }) => id === d.pieceId)?.enumeration,
        }));

      return [...acc, ...errorResults];
    },
    [],
  );

  const errors = errorPieces.length ? { errorPieces } : error;

  await handleReceiveErrorResponse(
    showCallout,
    errors,
    defaultError,
  );
};
