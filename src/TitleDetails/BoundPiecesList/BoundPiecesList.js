import PropTypes from 'prop-types';
import { useMemo } from 'react';

import {
  acqRowFormatter,
  PrevNextPagination,
} from '@folio/stripes-acq-components';
import { MultiColumnList } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { PIECE_COLUMN_MAPPING } from '../constants';
import { usePiecesList } from '../hooks';
import {
  BOUND_ITEMS_LIMIT,
  COLUMN_FORMATTER,
  VISIBLE_COLUMNS,
} from './constants';

export const BoundPiecesList = ({
  filters,
  id,
  title,
}) => {
  const stripes = useStripes();
  const {
    isFetching,
    pagination,
    pieces,
    setPagination,
    totalRecords,
  } = usePiecesList({
    filters,
    limit: BOUND_ITEMS_LIMIT,
    title,
    queryParams: {
      isBound: true,
    },
  });

  const onPageChange = newPagination => {
    setPagination({ ...newPagination, timestamp: new Date() });
  };

  const hasViewInventoryPermissions = stripes.hasPerm('ui-inventory.instance.view');
  const formatter = useMemo(() => {
    return COLUMN_FORMATTER(hasViewInventoryPermissions, title?.instanceId);
  }, [hasViewInventoryPermissions, title?.instanceId]);

  if (!pieces) return null;

  return (
    <>
      <MultiColumnList
        id={id}
        contentData={pieces}
        totalCount={totalRecords}
        columnMapping={PIECE_COLUMN_MAPPING}
        visibleColumns={VISIBLE_COLUMNS}
        formatter={formatter}
        interactive={false}
        rowFormatter={acqRowFormatter}
      />

      {pieces.length > 0 && (
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

BoundPiecesList.propTypes = {
  filters: PropTypes.object.isRequired,
  id: PropTypes.string,
  title: PropTypes.object.isRequired,
};
