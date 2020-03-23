import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Headline,
} from '@folio/stripes/components';

const Title = ({ instanceId, title }) => {
  const titleValue = instanceId
    ? (
      <Link
        data-testid="titleInstanceLink"
        to={`/inventory/view/${instanceId}`}
      >
        {title}
      </Link>
    )
    : title;

  return (
    <Headline>
      {titleValue}
    </Headline>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
  instanceId: PropTypes.string,
};

Title.defaultProps = {
  instanceId: '',
};

export default Title;
