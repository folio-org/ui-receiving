import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';

import {
  acqRowFormatter,
  PrevNextPagination,
} from '@folio/stripes-acq-components';
import {
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { PIECE_COLUMN_MAPPING } from '../constants';
import {
  BOUND_ITEMS_LIMIT,
  VISIBLE_COLUMNS,
} from './constants';
import { useItemsList } from './hooks';
import { getColumnFormatter } from './utils';

export const BoundPiecesList = ({ id, title }) => {
  const stripes = useStripes();
  const [pagination, setPagination] = useState({ limit: BOUND_ITEMS_LIMIT, offset: 0 });
  const { isFetching, items } = useItemsList({ titleId: title.id, poLineId: title.poLineId });

  const totalCount = items.length;

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
        contentData={items}
        totalCount={totalCount}
        columnMapping={PIECE_COLUMN_MAPPING}
        visibleColumns={VISIBLE_COLUMNS}
        formatter={formatter}
        interactive={false}
        rowFormatter={acqRowFormatter}
      />

      {totalCount > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalCount}
          disabled={isFetching}
          onChange={onPageChange}
        />
      )}
    </>
  );
};

BoundPiecesList.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.object.isRequired,
};
