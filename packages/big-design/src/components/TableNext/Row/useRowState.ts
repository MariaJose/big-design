import { OnItemSelectFn } from '../hooks';
import { TableSelectable } from '../types';

interface UseRowStateProps<T> {
  childRowIndex?: number;
  childrenRows?: T[];
  isExpandable: boolean;
  isParentRow: boolean;
  isSelected?: boolean;
  selectedItems: TableSelectable['selectedItems'];
  onExpandedRow?(parentRowIndex: number | null, parentRowId: string | undefined): void;
  onItemSelect?: OnItemSelectFn;
  parentRowIndex: number;
  rowId?: string;
  // TODO: update this
  getRowId?: (item: T) => string;
  parentRowId?: string;
}

export const useRowState = <T>({
  childRowIndex,
  childrenRows,
  isExpandable,
  isParentRow,
  isSelected,
  selectedItems,
  onExpandedRow,
  onItemSelect,
  parentRowIndex,
  rowId,
  getRowId,
  parentRowId,
}: UseRowStateProps<T>) => {
  const onChange = () => {
    if (onItemSelect) {
      onItemSelect({
        childRowIndex: childRowIndex ?? null,
        childrenRows: childrenRows ?? [],
        isParentRow,
        isExpandable,
        parentRowIndex,
        rowId,
        getRowId,
        parentRowId,
      });
    }
  };

  const onExpandedChange = () => {
    if (onExpandedRow) {
      onExpandedRow(parentRowIndex ?? null, parentRowId);
    }
  };

  const hasChildrenRows = Array.isArray(childrenRows);

  const allChildrenRowsSelected =
    isExpandable &&
    childrenRows?.every((childRow, childRowIndex) => {
      if (rowId !== undefined && getRowId) {
        return selectedItems[getRowId(childRow)] !== undefined;
        // eslint-disable-next-line no-else-return
      } else {
        return selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;
      }
    });

  const someChildrenRowsSelected =
    isExpandable &&
    childrenRows?.some((childRow, childRowIndex) => {
      if (rowId !== undefined && getRowId) {
        return selectedItems[getRowId(childRow)] !== undefined;
      }

      return selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;
    });

  const isChecked = isExpandable && hasChildrenRows ? allChildrenRowsSelected : isSelected;

  const isIndeterminate = isExpandable && hasChildrenRows ? someChildrenRowsSelected : undefined;

  const label = isSelected ? `Selected` : `Unselected`;

  return {
    hasChildrenRows,
    isChecked,
    isIndeterminate,
    label,
    onChange,
    onExpandedChange,
  };
};
