import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  LocationFilterContainer,
  MaterialTypeFilterContainer,
  ORDER_FORMAT_OPTIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PIECE_STATUS_OPTIONS,
  PluggableOrganizationFilter,
} from '@folio/stripes-acq-components';

import { FILTERS } from '../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const ReceivingListFilter = ({
  activeFilters,
  applyFilters,
  disabled,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={`filter-${FILTERS.ORDER_STATUS}`}
        activeFilters={activeFilters[FILTERS.ORDER_STATUS]}
        disabled={disabled}
        labelId="ui-receiving.filter.orderStatus"
        name={FILTERS.ORDER_STATUS}
        onChange={adaptedApplyFilters}
        options={ORDER_STATUS_OPTIONS}
      />

      <PluggableOrganizationFilter
        id={`filter-${FILTERS.ORDER_ORGANIZATION}`}
        activeFilters={activeFilters[FILTERS.ORDER_ORGANIZATION]}
        disabled={disabled}
        labelId="ui-receiving.filter.vendor"
        name={FILTERS.ORDER_ORGANIZATION}
        onChange={adaptedApplyFilters}
      />

      <AcqCheckboxFilter
        id={`filter-${FILTERS.ORDER_TYPE}`}
        activeFilters={activeFilters[FILTERS.ORDER_TYPE]}
        disabled={disabled}
        labelId="ui-receiving.filter.orderType"
        name={FILTERS.ORDER_TYPE}
        onChange={adaptedApplyFilters}
        options={ORDER_TYPE_OPTIONS}
      />

      <MaterialTypeFilterContainer
        id={`filter-${FILTERS.MATERIAL_TYPE}`}
        activeFilters={activeFilters[FILTERS.MATERIAL_TYPE]}
        disabled={disabled}
        labelId="ui-receiving.filter.materialType"
        name={FILTERS.MATERIAL_TYPE}
        onChange={adaptedApplyFilters}
      />

      <AcqCheckboxFilter
        id={`filter-${FILTERS.ORDER_FORMAT}`}
        activeFilters={activeFilters[FILTERS.ORDER_FORMAT]}
        disabled={disabled}
        labelId="ui-receiving.filter.orderFormat"
        name={FILTERS.ORDER_FORMAT}
        onChange={adaptedApplyFilters}
        options={ORDER_FORMAT_OPTIONS}
      />

      <AcqTagsFilter
        id={`filter-${FILTERS.POL_TAGS}`}
        activeFilters={activeFilters[FILTERS.POL_TAGS]}
        disabled={disabled}
        name={FILTERS.POL_TAGS}
        onChange={adaptedApplyFilters}
      />

      <LocationFilterContainer
        id={`filter-${FILTERS.LOCATION}`}
        activeFilter={activeFilters[FILTERS.LOCATION] && activeFilters[FILTERS.LOCATION][0]}
        disabled={disabled}
        labelId="ui-receiving.filter.location"
        name={FILTERS.LOCATION}
        onChange={adaptedApplyFilters}
      />

      <AcqCheckboxFilter
        id={`filter-${FILTERS.RECEIVING_STATUS}`}
        activeFilters={activeFilters[FILTERS.RECEIVING_STATUS]}
        disabled={disabled}
        labelId="ui-receiving.filter.receivingStatus"
        name={FILTERS.RECEIVING_STATUS}
        onChange={adaptedApplyFilters}
        options={PIECE_STATUS_OPTIONS}
      />

      <AcqUnitFilter
        id={`filter-${FILTERS.ACQUISITIONS_UNIT}`}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        disabled={disabled}
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />

      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.RECEIVED_DATE]}
        labelId="ui-receiving.piece.receivedDate"
        name={FILTERS.RECEIVED_DATE}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.EXPECTED_RECEIPT_DATE]}
        labelId="ui-receiving.piece.receiptDate"
        name={FILTERS.EXPECTED_RECEIPT_DATE}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.RECEIPT_DUE]}
        labelId="ui-receiving.title.receiptDue"
        name={FILTERS.RECEIPT_DUE}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />
    </AccordionSet>
  );
};

ReceivingListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ReceivingListFilter;
