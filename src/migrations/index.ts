import * as migration_20261023_145013_initial from './20261023_145013_initial';
import * as migration_20261023_151926_vehicles from './20261023_151926_vehicles';

export const migrations = [
  {
    up: migration_20261023_145013_initial.up,
    down: migration_20261023_145013_initial.down,
    name: '20261023_145013_initial',
  },
  {
    up: migration_20261023_151926_vehicles.up,
    down: migration_20261023_151926_vehicles.down,
    name: '20261023_151926_vehicles'
  },
];
