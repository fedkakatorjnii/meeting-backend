export const getColumnsWithPrefix = (names: string[], prefix: string) => {
  return names.map((name) => `${prefix}.${name}`);
};
