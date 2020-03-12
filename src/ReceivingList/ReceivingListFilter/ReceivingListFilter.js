import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
  AcqTagsFilter,
  LocationFilterContainer,
  MaterialTypeFilterContainer,
  ORDER_FORMAT_OPTIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PluggableOrganizationFilter,
} from '@folio/stripes-acq-components';

const FILTERS = {
  ORDER_STATUS: 'purchaseOrder.workflowStatus',
  ORDER_ORGANIZATION: 'purchaseOrder.vendor',
  POL_TAGS: 'poLine.tags.tagList',
  ORDER_TYPE: 'purchaseOrder.orderType',
  ORDER_FORMAT: 'poLine.orderFormat',
  LOCATION: 'poLine.locations',
  MATERIAL_TYPE: 'materialType',
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
        labelId="ui-receiving.filter.orderStatus"
        name={FILTERS.ORDER_STATUS}
        onChange={adaptedApplyFilters}
        options={ORDER_STATUS_OPTIONS}
      />

      <PluggableOrganizationFilter
        id={FILTERS.ORDER_ORGANIZATION}
        activeFilters={activeFilters[FILTERS.ORDER_ORGANIZATION]}
        labelId="ui-receiving.filter.vendor"
        name={FILTERS.ORDER_ORGANIZATION}
        onChange={adaptedApplyFilters}
      />

      <AcqCheckboxFilter
        id={FILTERS.ORDER_TYPE}
        activeFilters={activeFilters[FILTERS.ORDER_TYPE]}
        labelId="ui-receiving.filter.orderType"
        name={FILTERS.ORDER_TYPE}
        onChange={adaptedApplyFilters}
        options={ORDER_TYPE_OPTIONS}
      />

      <MaterialTypeFilterContainer
        id={FILTERS.MATERIAL_TYPE}
        activeFilters={activeFilters[FILTERS.MATERIAL_TYPE]}
        labelId="ui-receiving.filter.materialType"
        name={FILTERS.MATERIAL_TYPE}
        onChange={adaptedApplyFilters}
      />

      <AcqCheckboxFilter
        id={FILTERS.ORDER_FORMAT}
        activeFilters={activeFilters[FILTERS.ORDER_FORMAT]}
        labelId="ui-receiving.filter.orderFormat"
        name={FILTERS.ORDER_FORMAT}
        onChange={adaptedApplyFilters}
        options={ORDER_FORMAT_OPTIONS}
      />

      <AcqTagsFilter
        id={FILTERS.POL_TAGS}
        activeFilters={activeFilters[FILTERS.POL_TAGS]}
        name={FILTERS.POL_TAGS}
        onChange={adaptedApplyFilters}
      />

      <LocationFilterContainer
        id={FILTERS.LOCATION}
        activeFilter={activeFilters[FILTERS.LOCATION] && activeFilters[FILTERS.LOCATION][0]}
        labelId="ui-receiving.filter.location"
        name={FILTERS.LOCATION}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

ReceivingListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default ReceivingListFilter;
