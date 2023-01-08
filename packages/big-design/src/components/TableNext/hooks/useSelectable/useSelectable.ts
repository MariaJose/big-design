import { useEffect, useState } from 'react';

import { useEventCallback } from '../../../../hooks';
import { TableSelectable } from '../../types';

import {
  getTotalSelectedChildRows,
  selectChildRow,
  selectParentRow,
  SelectRowArg,
} from './helpers';

interface OnItemSelectFnArg
  extends Omit<
    SelectRowArg,
    'childRowIndex' | 'selectedItems' | 'setSelectedParentRowsCrossPages'
  > {
  childRowIndex: number | null;
  isParentRow: boolean;
  parentRowId: string;
  childRowId?: string;
  childrenRowsIds: string[];
}

export type OnItemSelectFn = ({
  childRowIndex,
  isParentRow,
  isExpandable,
  parentRowIndex,
  parentRowId,
  childRowId,
  childrenRowsIds,
}: OnItemSelectFnArg) => void;

export const useSelectable = (selectable?: TableSelectable) => {
  const isSelectable = Boolean(selectable);
  const isChildrenRowsSelectable = selectable?.isChildrenRowsSelectable ?? false;
  const [selectedItems, setSelectedItems] = useState<TableSelectable['selectedItems']>({});
  const [selectedParentRowsCrossPages, setSelectedParentRowsCrossPages] = useState<Set<string>>(
    new Set(),
  );

  const onItemSelectEventCallback: OnItemSelectFn = useEventCallback(
    ({
      childRowIndex,
      isParentRow,
      isExpandable,
      parentRowIndex,
      parentRowId,
      childRowId,
      childrenRowsIds,
    }) => {
      if (!selectable) {
        return;
      }

      const { onSelectionChange } = selectable;

      if (isParentRow) {
        const newSelectedItems = selectParentRow({
          isExpandable,
          parentRowIndex,
          selectedItems,
          setSelectedParentRowsCrossPages,
          parentRowId,
          childRowId,
          isChildrenRowsSelectable,
          childrenRowsIds,
        });

        onSelectionChange(newSelectedItems);
      } else if (childRowIndex !== null) {
        const totalSelectedChildRows = getTotalSelectedChildRows({
          parentRowIndex,
          selectedItems,
          parentRowId,
          setSelectedParentRowsCrossPages,
          childRowId,
          childrenRowsIds,
        });

        const isTheOnlySelectedChildRow = totalSelectedChildRows === 1;

        const newSelectedItems = selectChildRow({
          isTheOnlySelectedChildRow,
          parentRowIndex,
          selectedItems,
          childRowIndex,
          parentRowId,
          setSelectedParentRowsCrossPages,
          childRowId,
          isChildrenRowsSelectable,
          childrenRowsIds,
        });

        onSelectionChange(newSelectedItems);
      }
    },
  );

  useEffect(() => {
    if (selectable?.selectedItems) {
      setSelectedItems({ ...selectable.selectedItems });
    }
  }, [selectable?.selectedItems]);

  return {
    isSelectable,
    onItemSelect: isSelectable ? onItemSelectEventCallback : undefined,
    selectedItems,
    isChildrenRowsSelectable,
    selectedParentRowsCrossPages,
    setSelectedParentRowsCrossPages,
  };
};
