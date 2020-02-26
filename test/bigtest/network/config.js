import {
  configFunds,
  configMemberships,
  configTags,
  configUnits,
  configUsers,
  configLocations,
  configMaterialTypes,
  configLines,
} from '@folio/stripes-acq-components/test/bigtest/network';

import {
  configTitles,
  configItems,
  configPieces,
  configRequests,
  configTitleReceive,
} from './configs';

export default function config() {
  configFunds(this);
  configLocations(this);
  configMaterialTypes(this);
  configMemberships(this);
  configUnits(this);
  configTags(this);
  configUsers(this);
  configTitles(this);
  configItems(this);
  configPieces(this);
  configRequests(this);
  configLines(this);
  configTitleReceive(this);
}
