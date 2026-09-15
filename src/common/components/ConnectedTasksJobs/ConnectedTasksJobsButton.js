import PropTypes from 'prop-types';

import { ConnectedTasksJobsPlugin, connectedTasksJobsPropTypes } from './ConnectedTasksJobsPlugin';

export const ConnectedTasksJobsButton = props => (
  <ConnectedTasksJobsPlugin
    {...props}
    componentType="ConnectedTasksJobsButton"
  />
);

ConnectedTasksJobsButton.propTypes = {
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['dropdownItem', 'icon']),
  ...connectedTasksJobsPropTypes,
};
