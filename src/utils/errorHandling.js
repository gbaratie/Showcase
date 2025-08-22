export function handleError(error, customMessage = 'Une erreur est survenue') {
  console.error('Erreur:', error.message);
  alert(customMessage);
  return null;
}
