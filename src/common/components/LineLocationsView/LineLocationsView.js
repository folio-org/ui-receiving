import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Loading,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  useLineHoldings,
} from '@folio/stripes-acq-components';

const LineLocationsView = ({ poLine, locations }) => {
  const lineHoldingIds = poLine.locations.map(({ holdingId }) => holdingId).filter(Boolean);
  const { holdings, isLoading } = useLineHoldings(lineHoldingIds);

  const locationsToDisplay = useMemo(() => {
    const locationsMap = locations.reduce((acc, l) => ({ ...acc, [l.id]: l }), {});
    const holdingsMap = holdings.reduce((acc, h) => ({ ...acc, [h.id]: h }), {});
    const lineLocations = poLine.locations.map(({ holdingId, locationId }) => (
      holdingId
        ? holdings.length && getHoldingLocationName(holdingsMap[holdingId], locationsMap)
        : (locationsMap[locationId].name && `${locationsMap[locationId].name} (${locationsMap[locationId].code})`) || ''
    ));

    return lineLocations.filter(Boolean).join(', ');
  }, [holdings, locations, poLine.locations]);

  if (isLoading) {
    return (
      <>
        <Label>
          <FormattedMessage id="ui-receiving.piece.lineLocations" />
        </Label>
        <Loading />
      </>
    );
  }

  return (
    <>
      <Label>
        <FormattedMessage id="ui-receiving.piece.lineLocations" />
      </Label>
      {locationsToDisplay}
    </>
  );
};

LineLocationsView.propTypes = {
  poLine: PropTypes.object.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LineLocationsView;
