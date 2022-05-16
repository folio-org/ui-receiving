import {
  EXPORT_PIECE_FIELDS,
  EXPORT_TITLE_FIELDS,
} from '../constants';
import { isAllSelected } from './isAllSelected';

export const getExportFields = (formValues = {}) => {
  const {
    exportPieceFields,
    exportTitleFields,
    pieceFields: formPieceFields,
    titleFields: formTitleFields,
  } = formValues;

  const titleFields = (
    isAllSelected(exportTitleFields)
      ? Object.keys(EXPORT_TITLE_FIELDS)
      : formTitleFields.map(({ value }) => value)
  );

  const pieceFields = (
    isAllSelected(exportPieceFields)
      ? Object.keys(EXPORT_PIECE_FIELDS)
      : formPieceFields.map(({ value }) => value)
  );

  return [...titleFields, ...pieceFields];
};
