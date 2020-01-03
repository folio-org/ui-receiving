import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
} from '@folio/stripes-acq-components';

const FILTERS = {
  ORDER_STATUS: 'orderStatus',
};

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const ReceivingListFilter = ({
  activeFilters,
  applyFilters,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={FILTERS.ORDER_STATUS}
        activeFilters={activeFilters[FILTERS.ORDER_STATUS]}
        labelId="ui-receiving.titles.orderStatus"
        name={FILTERS.ORDER_STATUS}
        onChange={adaptedApplyFilters}
        options={[]}
      />
    </AccordionSet>
  );
};

ReceivingListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default ReceivingListFilter;
