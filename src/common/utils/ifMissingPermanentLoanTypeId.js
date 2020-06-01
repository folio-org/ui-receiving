export async function ifMissingPermanentLoanTypeId(response) {
  let parsed;

  try {
    parsed = await response.json();
  // eslint-disable-next-line no-empty
  } catch (parsingException) {
  }

  return parsed?.errors?.some(({ parameters }) => parameters?.some(({ key }) => key === 'permanentLoanTypeId'));
}
