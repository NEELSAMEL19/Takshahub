
export const camelToSnake = (str: string) =>
  str.replace(/([A-Z])/g, "_$1").toLowerCase();
