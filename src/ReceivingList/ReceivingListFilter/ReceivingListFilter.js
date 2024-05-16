import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { AccordionSet } from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  BooleanFilter,
  LocationFilterContainer,
  MaterialTypeFilterContainer,
  ORDER_FORMAT_OPTIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  PIECE_STATUS_OPTIONS,
  PluggableOrganizationFilter,
  PluggableUserFilter,
} from '@folio/stripes-acq-components';

import { FILTERS } from '../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const ReceivingListFilter = ({
  activeFilters,
  applyFilters,
  centralOrdering = false,
  disabled,
}) => {
  const adaptedApplyFilters = useCallback((data) => applyFiltersAdapter(applyFilters)(data), [applyFilters]);

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
        activeFilter={activeFilters[FILTERS.LOCATION]}
        disabled={disabled}
        labelId="ui-receiving.filter.location"
        name={FILTERS.LOCATION}
        onChange={adaptedApplyFilters}
        crossTenant={centralOrdering}
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

      <BooleanFilter
        id={`filter-${FILTERS.BINDERY_ACTIVE}`}
        activeFilters={activeFilters[FILTERS.BINDERY_ACTIVE]}
        disabled={disabled}
        labelId="ui-receiving.filter.isBinderyActive"
        name={FILTERS.BINDERY_ACTIVE}
        onChange={adaptedApplyFilters}
      />

      <AcqUnitFilter
        id={`filter-${FILTERS.ACQUISITIONS_UNIT}`}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        disabled={disabled}
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />

      <BooleanFilter
        id={`filter-${FILTERS.RUSH}`}
        activeFilters={activeFilters[FILTERS.RUSH]}
        disabled={disabled}
        labelId="ui-receiving.filter.rush"
        name={FILTERS.RUSH}
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

      <PluggableUserFilter
        id={FILTERS.CREATED_BY}
        activeFilters={activeFilters[FILTERS.CREATED_BY]}
        labelId="ui-receiving.filter.createdBy"
        name={FILTERS.CREATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        labelId="ui-receiving.filter.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <PluggableUserFilter
        id={FILTERS.UPDATED_BY}
        activeFilters={activeFilters[FILTERS.UPDATED_BY]}
        labelId="ui-receiving.filter.updatedBy"
        name={FILTERS.UPDATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.DATE_UPDATED}
        activeFilters={activeFilters[FILTERS.DATE_UPDATED]}
        labelId="ui-receiving.filter.dateUpdated"
        name={FILTERS.DATE_UPDATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <PluggableUserFilter
        id={FILTERS.PIECE_CREATED_BY}
        activeFilters={activeFilters[FILTERS.PIECE_CREATED_BY]}
        labelId="ui-receiving.filter.piece.createdBy"
        name={FILTERS.PIECE_CREATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.PIECE_DATE_CREATED}
        activeFilters={activeFilters[FILTERS.PIECE_DATE_CREATED]}
        labelId="ui-receiving.filter.piece.dateCreated"
        name={FILTERS.PIECE_DATE_CREATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <PluggableUserFilter
        id={FILTERS.PIECE_UPDATED_BY}
        activeFilters={activeFilters[FILTERS.PIECE_UPDATED_BY]}
        labelId="ui-receiving.filter.piece.updatedBy"
        name={FILTERS.PIECE_UPDATED_BY}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />

      <AcqDateRangeFilter
        id={FILTERS.PIECE_DATE_UPDATED}
        activeFilters={activeFilters[FILTERS.PIECE_DATE_UPDATED]}
        labelId="ui-receiving.filter.piece.dateUpdated"
        name={FILTERS.PIECE_DATE_UPDATED}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />
    </AccordionSet>
  );
};

ReceivingListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  centralOrdering: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
};

export default ReceivingListFilter;
