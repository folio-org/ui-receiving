import {
  configFunds,
  configMemberships,
  configTags,
  configUnits,
  configUsers,
  configLocations,
  configMaterialTypes,
} from '@folio/stripes-acq-components/test/bigtest/network';

import { PO_LINES_API } from '../../../src/common/constants';
import { configTitles } from './configs';

export default function config() {
  configFunds(this);
  configLocations(this);
  configMaterialTypes(this);
  configMemberships(this);
  configUnits(this);
  configTags(this);
  configUsers(this);
  configTitles(this);

  this.get(PO_LINES_API, () => ({ poLines: [] }));
}
