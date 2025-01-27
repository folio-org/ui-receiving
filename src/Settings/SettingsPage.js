import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import { NumberGeneratorSettings } from './NumberGeneratorSettings';
import { SETTINGS_RECEIVING_NUMBER_GENERATOR_ROUTE } from '../constants';

const SettingsPage = ({ location, match, ...props }) => {
  const pages = [
    {
      component: NumberGeneratorSettings,
      label: <FormattedMessage id="ui-receiving.settings.numberGenerator.options" />,
      route: SETTINGS_RECEIVING_NUMBER_GENERATOR_ROUTE,
      perm: 'ui-receiving.settings.numberGenerator.options',
    },
  ];

  return (
    <Settings
      location={location}
      match={match}
      pages={pages}
      paneTitle={<FormattedMessage id="ui-receiving.meta.title" />}
      {...props}
    />
  );
};

SettingsPage.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default SettingsPage;
