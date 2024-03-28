import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect, withStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import NumberGeneratorOptionsForm from './NumberGeneratorOptionsForm';
import { NUM_GEN_CONFIG_SETTING } from '../../common/constants';

class NumberGeneratorOptions extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.connectedConfigManager = stripesConnect(ConfigManager);
  }

  defaultValues = {
    barcodeGeneratorSetting: 'useTextField',
  };

  beforeSave(data) {
    return JSON.stringify(data);
  }

  getInitialValues = (settings) => {
    let loadedValues = {};

    try {
      const value = settings.length === 0 ? '' : settings[0].value;

      loadedValues = JSON.parse(value);
    } catch (e) {
      // Make sure we return _something_ because ConfigManager no longer has a safety check here
      return {};
    }

    return {
      ...this.defaultValues,
      ...loadedValues,
    };
  };

  render() {
    return (
      <this.connectedConfigManager
        configName={NUM_GEN_CONFIG_SETTING}
        getInitialValues={this.getInitialValues}
        label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions" />}
        moduleName="RECEIVING"
        onBeforeSave={this.beforeSave}
        stripes={this.props.stripes}
        formType="final-form"
      >
        <NumberGeneratorOptionsForm />
      </this.connectedConfigManager>
    );
  }
}

export default withStripes(NumberGeneratorOptions);
