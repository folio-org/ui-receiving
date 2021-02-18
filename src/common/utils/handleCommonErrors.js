export async function handleCommonErrors(showCallout, response) {
  let parsed = response;
  let hasCommonErrors = false;

  try {
    parsed = await response.json();
  // eslint-disable-next-line no-empty
  } catch (parsingException) {
  }

  if (parsed?.errors?.length) {
    parsed.errors.forEach(({ parameters }) => {
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
    });
  }

  return hasCommonErrors;
}
