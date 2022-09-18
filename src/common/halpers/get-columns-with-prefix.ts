export const getColumnsWithPrefix = <T extends string>(
  names: T[],
  prefix: string,
) => {
  return names.map((name) => `${prefix}.${name}`);
};
