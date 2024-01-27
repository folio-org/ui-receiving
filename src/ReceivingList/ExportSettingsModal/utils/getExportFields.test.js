import {
  EXPORT_FIELDS_PARAMS,
  EXPORT_PIECE_FIELDS,
  EXPORT_TITLE_FIELDS,
} from '../constants';
import { getExportFields } from './getExportFields';

describe('getExportFields', () => {
  it('should return for export an array with all fields', () => {
    const exportSettings = {
      exportPieceFields: EXPORT_FIELDS_PARAMS.all,
      exportTitleFields: EXPORT_FIELDS_PARAMS.all,
    };

    const fields = getExportFields(exportSettings);

    expect(fields).toEqual([
      ...Object.keys(EXPORT_TITLE_FIELDS),
      ...Object.keys(EXPORT_PIECE_FIELDS),
    ]);
  });

  it('should return for export an array with selected fields', () => {
    const titleFields = [{ value: 'title' }];
    const pieceFields = [{ value: 'displaySummary' }];

    const exportSettings = {
      exportPieceFields: EXPORT_FIELDS_PARAMS.selected,
      exportTitleFields: EXPORT_FIELDS_PARAMS.selected,
      pieceFields,
      titleFields,
    };

    const fields = getExportFields(exportSettings);

    expect(fields).toEqual(['title', 'displaySummary']);
  });
});
