import PropTypes from 'prop-types';

import {
  IconButton,
  Tooltip,
} from '@folio/stripes/components';

const NumberGeneratorButton = ({
  disabled,
  onClick,
  tooltipId,
  tooltipLabel,
}) => {
  return (
    <Tooltip
      id={tooltipId}
      text={tooltipLabel}
    >
      {({ ref, ariaIds }) => (
        <IconButton
          ref={ref}
          aria-labelledby={ariaIds.text}
          disabled={disabled}
          icon="number-generator"
          onClick={onClick}
        />
      )}
    </Tooltip>
  );
};

NumberGeneratorButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  tooltipId: PropTypes.string.isRequired,
  tooltipLabel: PropTypes.node.isRequired,
};

export default NumberGeneratorButton;
