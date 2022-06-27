import { useEffect, useState } from 'react';

import { useEventCallback } from '../../../../hooks';
import { TableSelectable } from '../../types';

import { getTotalSelectedChildRows, selectChildRow, selectParentRow } from './helpers';

export const useSelectable = <T>(selectable?: TableSelectable) => {
  const isSelectable = Boolean(selectable);
  const [selectedItems, setSelectedItems] = useState<TableSelectable['selectedItems']>({});

  const selectableConditionalDep = selectable ? selectable.selectedItems : null;

  const onItemSelectEventCallback = useEventCallback(
    (
      childRowIndex: number | null,
      parentRowIndex: number,
      childrenRows: T[],
      isParentRow: boolean,
      isExpandable: boolean,
    ) => {
      if (!selectable) {
        return;
      }

      const { onSelectionChange } = selectable;
      const isSelectedParent = selectedItems[parentRowIndex] !== undefined;
      const newSelectedItems = { ...selectedItems };

      if (isParentRow) {
        selectParentRow(
          childrenRows,
          isExpandable,
          isSelectedParent,
          onSelectionChange,
          parentRowIndex,
          newSelectedItems,
        );
      } else if (childRowIndex !== null) {
        const totalSelectedChildRows = getTotalSelectedChildRows(
          childrenRows,
          parentRowIndex,
          selectedItems,
        );

        const isTheOnlySelectedChildRow = totalSelectedChildRows === 1;

        selectChildRow(
          childRowIndex,
          isSelectedParent,
          isTheOnlySelectedChildRow,
          onSelectionChange,
          parentRowIndex,
          newSelectedItems,
        );
      }
    },
  );

  useEffect(() => {
    if (selectable) {
      const newSelectedItems = { ...selectable.selectedItems };

      setSelectedItems(newSelectedItems);
    }
  }, [selectable, selectableConditionalDep]);

  return {
    isSelectable,
    onItemSelect: isSelectable ? onItemSelectEventCallback : undefined,
    selectedItems,
  };
};
