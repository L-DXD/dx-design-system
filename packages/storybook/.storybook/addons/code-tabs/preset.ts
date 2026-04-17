import { resolve } from 'path';

export const managerEntries = (entry: string[] = []) => [
  ...entry,
  resolve(__dirname, 'register'),
];
