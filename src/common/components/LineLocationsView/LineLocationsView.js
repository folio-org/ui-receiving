import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Loading,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';

const LineLocationsView = ({
  crossTenant = false,
  instanceId,
  poLine,
  locations,
}) => {
  const { holdings, isLoading } = useInstanceHoldingsQuery(instanceId, { consortium: crossTenant });

  const locationsToDisplay = useMemo(() => {
    const locationsMap = locations.reduce((acc, l) => ({ ...acc, [l.id]: l }), {});
    const holdingsMap = holdings.reduce((acc, h) => ({ ...acc, [h.id]: h }), {});
    const lineLocations = poLine.locations.map(({ holdingId, locationId }) => (
      holdingId
        ? holdings.length && holdingsMap[holdingId] && getHoldingLocationName(holdingsMap[holdingId], locationsMap)
        : (locationsMap[locationId]?.name && `${locationsMap[locationId].name} (${locationsMap[locationId].code})`) || ''
    ));

    return lineLocations.filter(Boolean).join(', ');
  }, [holdings, locations, poLine.locations]);

  return (
    <>
      <Label>
        <FormattedMessage id="ui-receiving.piece.lineLocations" />
      </Label>
      {isLoading ? <Loading /> : locationsToDisplay}
    </>
  );
};

LineLocationsView.propTypes = {
  crossTenant: PropTypes.bool,
  instanceId: PropTypes.string,
  poLine: PropTypes.object.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LineLocationsView;
