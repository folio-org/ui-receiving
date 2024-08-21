import { createForm } from 'final-form';

import { setLocationValueFormMutator } from './setLocationValueFormMutator';

describe('setLocationValueFormMutator', () => {
  let form;
  let changeValue;

  beforeEach(() => {
    changeValue = jest.fn();
    form = createForm({
      onSubmit: jest.fn(),
      mutators: { setLocationValueFormMutator },
    });
    form.mutators.setLocationValueFormMutator = setLocationValueFormMutator;
  });

  it('should set the location field value with location id when holdingId is not provided', () => {
    const state = form.getState();
    const location = { id: 'location-1' };

    setLocationValueFormMutator(
      [location, 'locationField', 'holdingField', undefined],
      state,
      { changeValue },
    );

    expect(changeValue).toHaveBeenCalledWith(state, 'locationField', expect.any(Function));
    expect(changeValue.mock.calls[0][2]()).toBe(location.id);
  });

  it('should set the location field value with location when location is string and holdingId is not provided', () => {
    const state = form.getState();
    const location = 'location-1';

    setLocationValueFormMutator(
      [location, 'locationField', 'holdingField', undefined],
      state,
      { changeValue },
    );

    expect(changeValue).toHaveBeenCalledWith(state, 'locationField', expect.any(Function));
    expect(changeValue.mock.calls[0][2]()).toBe(location);
  });

  it('should set the holding field value when holdingId is provided', () => {
    const state = form.getState();
    const location = 'location-1';
    const holdingId = 'holding-1';

    setLocationValueFormMutator(
      [location, 'locationField', 'holdingField', holdingId],
      state,
      { changeValue },
    );

    expect(changeValue).toHaveBeenCalledWith(state, 'locationField', expect.any(Function));
    expect(changeValue).toHaveBeenCalledWith(state, 'holdingField', expect.any(Function));

    expect(changeValue.mock.calls[0][2]()).toBe(undefined);
    expect(changeValue.mock.calls[1][2]()).toBe(holdingId);
  });
});
