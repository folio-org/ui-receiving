import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import { NumberGeneratorSettings } from './NumberGeneratorSettings';

const SettingsPage = ({ location, match, ...props }) => {
  const pages = [
    {
      component: NumberGeneratorSettings,
      label: <FormattedMessage id="ui-receiving.settings.numberGenerator.label" />,
      route: 'numberGeneratorOptions',
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
