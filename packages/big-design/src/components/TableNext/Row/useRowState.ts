import { OnItemSelectFn } from '../hooks';
import { TableSelectable } from '../types';

interface UseRowStateProps {
  childRowIndex?: number;
  isExpandable: boolean;
  isParentRow: boolean;
  isSelected?: boolean;
  childRowId?: string;
  selectedItems: TableSelectable['selectedItems'];
  onExpandedRow?(parentRowId: string | undefined): void;
  onItemSelect?: OnItemSelectFn;
  parentRowIndex: number;
  parentRowId: string;
  isChildrenRowsSelectable: boolean;
  childrenRowsIds: string[];
}

export const useRowState = ({
  childRowIndex,
  isExpandable,
  isParentRow,
  isSelected,
  selectedItems,
  onExpandedRow,
  onItemSelect,
  parentRowIndex,
  parentRowId,
  childRowId,
  isChildrenRowsSelectable,
  childrenRowsIds,
}: UseRowStateProps) => {
  const onChange = () => {
    if (onItemSelect) {
      onItemSelect({
        childRowIndex: childRowIndex ?? null,
        isParentRow,
        isExpandable,
        parentRowIndex,
        parentRowId,
        childRowId,
        childrenRowsIds,
      });
    }
  };

  const onExpandedChange = () => {
    if (onExpandedRow) {
      onExpandedRow(parentRowId);
    }
  };

  const isRowChecked = () => {
    if (isParentRow) {
      return isChildrenRowsSelectable && hasChildrenRows ? allChildrenRowsSelected : isSelected;
    }

    return isSelected;
  };

  const isRowIndeterminate = () => {
    if (isParentRow) {
      return isChildrenRowsSelectable && hasChildrenRows ? someChildrenRowsSelected : false;
    }

    return false;
  };

  const hasChildrenRows = Boolean(childrenRowsIds?.length !== 0);

  const allChildrenRowsSelected =
    isExpandable &&
    hasChildrenRows &&
    childrenRowsIds.every((childRowId) => {
      return selectedItems[childRowId] !== undefined;
    });

  const someChildrenRowsSelected =
    isExpandable &&
    hasChildrenRows &&
    childrenRowsIds.some((childRowId) => {
      return selectedItems[childRowId] !== undefined;
    });

  const isChecked = isRowChecked();

  const isIndeterminate = isRowIndeterminate();

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
