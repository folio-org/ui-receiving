/* eslint-disable filenames/match-exported */
import React, { createRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Settings as SettingsSMACOM } from '@folio/stripes/smart-components';

import NumberGeneratorOptions from './NumberGeneratorOptions';

class ReceivingSettings extends React.Component {
  constructor(props) {
    super(props);

    this.pages = [
      {
        route: 'numbergeneratoroptions',
        label: <FormattedMessage id="ui-receiving.settings.numberGeneratorOptions" />,
        component: NumberGeneratorOptions,
        interface: 'servint',
        perm: 'ui-receiving.settings.numberGenerator.manage',
      },
    ];

    this.paneTitleRef = createRef();
  }

  componentDidMount() {
    if (this.paneTitleRef.current) {
      this.paneTitleRef.current.focus();
    }
  }

  addPerm = permission => {
    const { stripes } = this.props;

    return stripes.hasPerm(permission) ? permission : 'ui-receiving.settings.receiving.enabled';
  };

  render() {
    return (
      <SettingsSMACOM
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-receiving.meta.title" />}
        paneTitleRef={this.paneTitleRef}
        data-test-inventory-settings
      />
    );
  }
}

ReceivingSettings.propTypes = {
  stripes: PropTypes.object,
};

export default ReceivingSettings;
