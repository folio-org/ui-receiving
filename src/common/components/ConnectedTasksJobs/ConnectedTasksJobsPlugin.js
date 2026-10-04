import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { Pluggable } from '@folio/stripes/core';

import { CONNECTED_RECORD_TYPES } from '../../constants';

export const connectedTasksJobsPropTypes = {
  recordId: PropTypes.string.isRequired,
  recordObject: PropTypes.object,
  recordType: PropTypes.oneOf(Object.values(CONNECTED_RECORD_TYPES)).isRequired,
};

export const ConnectedTasksJobsPlugin = ({
  componentType,
  onClick,
  recordId,
  recordObject,
  recordType,
  variant,
}) => {
  const location = useLocation();

  return (
    <Pluggable
      componentType={componentType}
      onClick={onClick}
      recordId={recordId}
      recordObject={recordObject}
      recordType={recordType}
      recordUrl={`${location.pathname}${location.search || ''}`}
      type="task-list"
      variant={variant}
    />
  );
};

ConnectedTasksJobsPlugin.propTypes = {
  componentType: PropTypes.oneOf([
    'ConnectedTasksJobsButton',
    'ConnectedTasksJobsPane',
  ]).isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['dropdownItem', 'icon']),
  ...connectedTasksJobsPropTypes,
};
