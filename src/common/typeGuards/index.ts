// lat = latitude = широта
// log = longitude = долгота

export const isPoint = (value: any): value is [number, number] => {
  if (!Array.isArray(value)) return false;
  if (value.length !== 2) return false;

  const [lat, log] = value;

  if (typeof lat !== 'number') return false;
  if (typeof log !== 'number') return false;

  return true;
};
