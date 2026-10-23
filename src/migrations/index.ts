import * as migration_20261023_145013_initial from './20261023_145013_initial';

export const migrations = [
  {
    up: migration_20261023_145013_initial.up,
    down: migration_20261023_145013_initial.down,
    name: '20261023_145013_initial'
  },
];
