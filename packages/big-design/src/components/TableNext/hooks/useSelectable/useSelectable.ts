import { useEffect, useState } from 'react';

import { useEventCallback } from '../../../../hooks';
import { TableSelectable } from '../../types';

import {
  getTotalSelectedChildRows,
  selectChildRow,
  selectParentRow,
  SelectRowArg,
} from './helpers';

interface OnItemSelectFnArg<T>
  extends Omit<SelectRowArg<T>, 'childRowIndex' | 'selectedItems' | 'setSelectedItemsRecord'> {
  childRowIndex: number | null;
  isParentRow: boolean;
  rowId?: string;
  getRowId?: (item: T) => string;
  parentRowId?: string;
  // setSelectedItemsRecord: Dispatch<SetStateAction<Set<string> | undefined>>;
}

export type OnItemSelectFn = <T>({
  childRowIndex,
  childrenRows,
  isParentRow,
  isExpandable,
  parentRowIndex,
  // rowId,
  getRowId,
  parentRowId,
}: OnItemSelectFnArg<T>) => void;

export const useSelectable = (selectable?: TableSelectable) => {
  const isSelectable = Boolean(selectable);
  const [selectedItems, setSelectedItems] = useState<TableSelectable['selectedItems']>({});
  // TODO: check types
  const [selectedItemsRecord, setSelectedItemsRecord] = useState<Set<string>>(new Set());

  const onItemSelectEventCallback: OnItemSelectFn = useEventCallback(
    ({
      childRowIndex,
      childrenRows,
      isParentRow,
      isExpandable,
      parentRowIndex,
      getRowId,
      parentRowId,
    }) => {
      if (!selectable) {
        return;
      }

      const { onSelectionChange } = selectable;

      if (isParentRow) {
        const newSelectedItems = selectParentRow({
          childrenRows,
          isExpandable,
          parentRowIndex,
          selectedItems,
          getRowId,
          parentRowId,
          setSelectedItemsRecord,
        });

        onSelectionChange(newSelectedItems);
      } else if (childRowIndex !== null || parentRowId !== undefined || getRowId !== undefined) {
        const totalSelectedChildRows = getTotalSelectedChildRows({
          childrenRows,
          parentRowIndex,
          selectedItems,
          getRowId,
          parentRowId,
          setSelectedItemsRecord,
        });

        const isTheOnlySelectedChildRow = totalSelectedChildRows === 1;

        const newSelectedItems = selectChildRow({
          isTheOnlySelectedChildRow,
          parentRowIndex,
          selectedItems,
          childrenRows,
          getRowId,
          childRowIndex,
          parentRowId,
          setSelectedItemsRecord,
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
    areChildrenRowsSelectable: selectable?.areChildrenRowsSelectable,
    selectedItemsRecord,
    setSelectedItemsRecord,
  };
};
