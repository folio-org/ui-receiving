import { handleCommonErrors } from './handleCommonErrors';

export async function handleReceiveErrorResponse(showCallout, response) {
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
    parsed.errorPieces.forEach(({ caption, processingStatus }) => {
      showCallout({
        messageId: `ui-receiving.errors.${processingStatus.error.code}`,
        type: 'error',
        values: { caption },
      });
    });

    return;
  }

  showCallout({ messageId: 'ui-receiving.title.actions.receive.error', type: 'error' });
}
