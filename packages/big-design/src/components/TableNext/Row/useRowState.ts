import { TableSelectable } from '../types';

interface UseRowStateProps<T> {
  childRowIndex?: number;
  childrenRows: T[];
  isExpandable: boolean;
  isParentRow: boolean;
  isSelected?: boolean;
  selectedItems: TableSelectable['selectedItems'];
  onExpandedRow?(parentRowIndex: number | null): void;
  onItemSelect?(
    childRowIndex: number | null,
    index: number,
    childrenRows: T[],
    isParentRow: boolean,
    isExpandable: boolean,
  ): void;
  parentRowIndex: number;
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
}: UseRowStateProps<T>) => {
  const onChange = () => {
    if (onItemSelect) {
      onItemSelect(childRowIndex ?? null, parentRowIndex, childrenRows, isParentRow, isExpandable);
    }
  };

  const onExpandedChange = () => {
    if (onExpandedRow) {
      onExpandedRow(parentRowIndex ?? null);
    }
  };

  const hasChildrenRows = childrenRows.length > 0;

  const allChildrenRowsSelected: boolean =
    isExpandable &&
    childrenRows.every((_childRow, childRowIndex) => {
      return selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;
    });

  const someChildrenRowsSelected: boolean =
    isExpandable &&
    childrenRows.some((_childRow, childRowIndex) => {
      return selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;
    });

  const label = isSelected ? `Selected` : `Unselected`;

  const isChecked = isExpandable && hasChildrenRows ? allChildrenRowsSelected : isSelected;
  const isIndeterminate = isExpandable && hasChildrenRows ? someChildrenRowsSelected : undefined;

  return {
    hasChildrenRows,
    isChecked,
    isIndeterminate,
    label,
    onChange,
    onExpandedChange,
  };
};
