import PropTypes from 'prop-types';
import { useMemo } from 'react';

import {
  acqRowFormatter,
  PrevNextPagination,
  useLocalPagination,
} from '@folio/stripes-acq-components';
import {
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { PIECE_COLUMN_MAPPING } from '../../Piece';
import {
  BOUND_ITEMS_LIMIT,
  VISIBLE_COLUMNS,
} from './constants';
import { useBoundItems } from './hooks';
import { getColumnFormatter } from './utils';

export const BoundItemsList = ({ id, title }) => {
  const stripes = useStripes();
  const { isFetching, items, totalRecords } = useBoundItems({ titleId: title.id, poLineId: title.poLineId });
  const { paginatedData, pagination, setPagination } = useLocalPagination(items, BOUND_ITEMS_LIMIT);

  const onPageChange = newPagination => {
    setPagination({ ...newPagination, timestamp: new Date() });
  };

  const hasViewInventoryPermissions = stripes.hasPerm('ui-inventory.instance.view');
  const formatter = useMemo(() => {
    return getColumnFormatter(hasViewInventoryPermissions, title?.instanceId);
  }, [hasViewInventoryPermissions, title?.instanceId]);

  if (isFetching) return <Loading />;

  return (
    <>
      <MultiColumnList
        id={id}
        contentData={paginatedData}
        totalCount={totalRecords}
        columnMapping={PIECE_COLUMN_MAPPING}
        visibleColumns={VISIBLE_COLUMNS}
        formatter={formatter}
        interactive={false}
        rowFormatter={acqRowFormatter}
      />

      {totalRecords > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalRecords}
          disabled={isFetching}
          onChange={onPageChange}
        />
      )}
    </>
  );
};

BoundItemsList.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.object.isRequired,
};
