import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Loading,
  KeyValue,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';

const LineLocationsView = ({
  crossTenant = false,
  instanceId,
  poLine = {},
  locations,
}) => {
  const intl = useIntl();

  const { holdings, isLoading } = useInstanceHoldingsQuery(instanceId, { consortium: crossTenant });

  const locationsToDisplay = useMemo(() => {
    const locationsMap = locations.reduce((acc, l) => ({ ...acc, [l.id]: l }), {});
    const holdingsMap = holdings.reduce((acc, h) => ({ ...acc, [h.id]: h }), {});
    const lineLocations = poLine.locations?.map(({ holdingId, locationId }) => (
      holdingId
        ? holdings.length && holdingsMap[holdingId] && getHoldingLocationName(holdingsMap[holdingId], locationsMap, intl.formatMessage({ id: 'ui-receiving.titles.invalidReference' }))
        : (locationsMap[locationId]?.name && `${locationsMap[locationId].name} (${locationsMap[locationId].code})`) || ''
    ));

    return lineLocations.filter(Boolean).join(', ');
  }, [holdings, intl, locations, poLine?.locations]);

  return <KeyValue
    label={<FormattedMessage id="ui-receiving.piece.lineLocations" />}
    value={isLoading ? <Loading /> : locationsToDisplay}
  />
};

LineLocationsView.propTypes = {
  crossTenant: PropTypes.bool,
  instanceId: PropTypes.string,
  poLine: PropTypes.object.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LineLocationsView;
