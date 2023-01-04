import { Dispatch, SetStateAction } from 'react';

import { TableSelectable } from '../../types';

export interface SelectRowArg<T> {
  childrenRows?: T[];
  childRowIndex?: number | null;
  isExpandable?: boolean;
  isTheOnlySelectedChildRow?: boolean;
  parentRowIndex: number;
  selectedItems: TableSelectable['selectedItems'];
  isParentRow?: boolean;
  rowId?: string;
  getRowId?: (item: T) => string;
  parentRowId?: string;
  // // TODO: check this
  // selectedItemsRecord: Set<T> | undefined;
  setSelectedItemsRecord: Dispatch<SetStateAction<Set<string>>>;
}

export function selectParentRow<T>({
  childrenRows,
  isExpandable,
  parentRowIndex,
  selectedItems,
  getRowId,
  parentRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>): TableSelectable['selectedItems'] {
  const parentRow = parentRowId !== undefined ? parentRowId : parentRowIndex;
  const isSelectedParent = selectedItems[parentRow] !== undefined;

  if (isSelectedParent) {
    const newSelectedItems = unselectParent({
      childrenRows,
      isExpandable,
      parentRowIndex,
      selectedItems,
      getRowId,
      parentRowId,
      setSelectedItemsRecord,
    });

    return newSelectedItems;
  }

  const newSelectedItems = selectParent({
    childrenRows,
    isExpandable,
    parentRowIndex,
    selectedItems,
    getRowId,
    parentRowId,
    setSelectedItemsRecord,
  });

  return newSelectedItems;
}

function unselectParent<T>({
  childrenRows,
  isExpandable,
  parentRowIndex,
  selectedItems,
  getRowId,
  parentRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>): TableSelectable['selectedItems'] {
  const hasChildrenRows = isExpandable && childrenRows !== undefined;

  // If parent has children, unselect it's childrenRows
  if (hasChildrenRows) {
    const newSelectedItems = unselectParentAndChildren({
      selectedItems,
      parentRowIndex,
      parentRowId,
      childrenRows,
      getRowId,
      setSelectedItemsRecord,
    });

    return newSelectedItems;
  }

  // Unselect the parent row
  const newSelectedItems = Object.entries(selectedItems).filter(([key]) => {
    // TODO: clean this
    if (getRowId !== undefined && parentRowId !== undefined) {
      return key !== parentRowId;
    }

    return key !== `${parentRowIndex}`;
  });

  if (getRowId !== undefined && parentRowId !== undefined) {
    setSelectedItemsRecord((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.delete(parentRowId);

      return newSet;
    });
  }

  return Object.fromEntries(newSelectedItems);
}

function unselectParentAndChildren<T>({
  selectedItems,
  parentRowIndex,
  childrenRows,
  parentRowId,
  getRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>) {
  if (parentRowId !== undefined && getRowId !== undefined) {
    const newSelectedItems = { ...selectedItems };

    setSelectedItemsRecord((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.delete(parentRowId);

      return newSet;
    });

    delete newSelectedItems[parentRowId];

    childrenRows?.forEach((childRow) => {
      delete newSelectedItems[getRowId(childRow)];
    });

    return newSelectedItems;
  }

  const newSelectedItems = Object.entries(selectedItems).filter(([key]) => {
    const [parentIndex] = key.split('.').map((key) => parseInt(key, 10));

    return parentIndex !== parentRowIndex;
  });

  return Object.fromEntries(newSelectedItems);
}

function selectParent<T>({
  childrenRows,
  isExpandable,
  parentRowIndex,
  selectedItems,
  parentRowId,
  getRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>): TableSelectable['selectedItems'] {
  // TODO: Check types.
  const parentRowIdentifier = parentRowId !== undefined ? parentRowId : String(parentRowIndex);
  const hasChildrenRows = isExpandable && childrenRows !== undefined;

  // If parent has children, select it's childrenRows
  if (hasChildrenRows) {
    const newSelectedItems = selectParentAndChildren({
      selectedItems,
      childrenRows,
      parentRowIndex,
      // rowId,
      parentRowId,
      getRowId,
      setSelectedItemsRecord,
    });

    return newSelectedItems;
  }

  if (parentRowId !== undefined && getRowId !== undefined) {
    setSelectedItemsRecord((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.add(parentRowId);

      return newSet;
    });

    return {
      ...selectedItems,
      [parentRowId]: true,
    };
  }

  return {
    ...selectedItems,
    [parentRowIdentifier]: true,
  };
}

function selectParentAndChildren<T>({
  selectedItems,
  childrenRows = [],
  parentRowIndex,
  getRowId,
  parentRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>) {
  // the rowId in here is the parent. TODO: change this as parentRowId and childRowId to prevent confusion.
  const parentRowIdentifier = parentRowId !== undefined ? parentRowId : parentRowIndex;
  const newSelectedItems = { ...selectedItems };

  // TODO: refactor this!

  newSelectedItems[parentRowIdentifier] = true;

  if (parentRowId !== undefined && getRowId !== undefined) {
    setSelectedItemsRecord((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.add(parentRowId);

      return newSet;
    });
  }

  for (let index = 0; index < childrenRows.length; index++) {
    if (parentRowId !== undefined && getRowId) {
      // TODO: check this type;
      const childrenRowId = getRowId(childrenRows[index]);

      newSelectedItems[childrenRowId] = true;
    } else {
      const childRowIndex = index;

      newSelectedItems[`${parentRowIndex}.${childRowIndex}`] = true;
    }
  }

  return newSelectedItems;
}

export function selectChildRow<T>({
  childRowIndex,
  isTheOnlySelectedChildRow,
  selectedItems,
  parentRowIndex,
  getRowId,
  childrenRows,
  parentRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>): TableSelectable['selectedItems'] {
  const parentRowID = parentRowId !== undefined ? parentRowId : parentRowIndex;
  const isSelectedParent = selectedItems[parentRowID] !== undefined;

  if (!isSelectedParent) {
    const newSelectedItems = selectChild({
      childRowIndex,
      parentRowIndex,
      selectedItems,
      childrenRows,
      getRowId,
      parentRowId,
      setSelectedItemsRecord,
    });

    return newSelectedItems;
  }

  // TODO: Check this
  const childRowId =
    getRowId !== undefined &&
    childrenRows !== undefined &&
    childRowIndex !== undefined &&
    childRowIndex !== null &&
    getRowId(childrenRows?.[childRowIndex]);
  const isSelectedChild = childRowId
    ? selectedItems[childRowId]
    : selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;

  if (isSelectedChild) {
    const newSelectedItems = unselectChild({
      selectedItems,
      parentRowIndex,
      childRowIndex,
      isTheOnlySelectedChildRow,
      getRowId,
      childrenRows,
      setSelectedItemsRecord,
      parentRowId,
    });

    return newSelectedItems;
  }

  // SelectedParent but child is not selected.
  const newSelectedItems = { ...selectedItems };

  // TODO: check types and check the logic, this is to select the parent when one child is missing.
  if (
    childRowId !== undefined &&
    childRowId !== null &&
    childRowId !== false &&
    parentRowId !== undefined &&
    getRowId !== undefined
  ) {
    newSelectedItems[childRowId] = true;
  } else {
    newSelectedItems[`${parentRowIndex}.${childRowIndex}`] = true;
  }

  return newSelectedItems;
}

function selectChild<T>({
  childRowIndex,
  parentRowIndex,
  selectedItems,
  childrenRows,
  getRowId,
  parentRowId,
  setSelectedItemsRecord,
}: SelectRowArg<T>): TableSelectable['selectedItems'] {
  const newSelectedItems = { ...selectedItems };

  // TODO: check this
  if (
    parentRowId !== undefined &&
    getRowId &&
    childrenRows !== undefined &&
    childRowIndex !== undefined &&
    childRowIndex !== null
  ) {
    newSelectedItems[parentRowId] = true;

    setSelectedItemsRecord((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.add(parentRowId);

      return newSet;
    });

    const childRowId = getRowId(childrenRows[childRowIndex]);

    newSelectedItems[childRowId] = true;

    return newSelectedItems;
  }

  newSelectedItems[`${parentRowIndex}`] = true;
  newSelectedItems[`${parentRowIndex}.${childRowIndex}`] = true;

  return newSelectedItems;
}

function unselectChild<T>({
  selectedItems,
  parentRowIndex,
  childRowIndex,
  isTheOnlySelectedChildRow,
  // rowId,
  getRowId,
  childrenRows,
  setSelectedItemsRecord,
  parentRowId,
}: SelectRowArg<T>) {
  // if (rowId && getRowId && childrenRows?.length) {
  //   const currentChildRow = childrenRows?.[index];
  //   const childRowId = getRowId(currentChildRow);

  //   return childRowId === key;
  // } else if (rowId && getRowId) {
  //   return rowId === key;
  // }

  // TODO: check this;
  if (
    // rowId !== undefined &&
    getRowId !== undefined &&
    childrenRows !== undefined &&
    childRowIndex !== undefined &&
    childRowIndex !== null &&
    parentRowId !== undefined
  ) {
    // TODO: the row Id is not the parent
    const newSelectedItems = { ...selectedItems };
    const childRow = childrenRows[childRowIndex];
    const childRowId = getRowId(childRow);

    delete newSelectedItems[childRowId];

    if (isTheOnlySelectedChildRow) {
      if (parentRowId !== undefined && getRowId !== undefined) {
        setSelectedItemsRecord((prevSelectedRecords) => {
          const newSet = new Set([...prevSelectedRecords]);

          newSet.delete(parentRowId);

          return newSet;
        });
      }
      // check in here if the intention was to unselect the parent? because teh rowId is not the parent.

      delete newSelectedItems[parentRowId];
    }

    return newSelectedItems;
  }

  const newSelectedItems = Object.entries(selectedItems)
    .filter(([key]) => key !== `${parentRowIndex}.${childRowIndex}`)
    .filter(([key]) => {
      // Remove the parent row if it's the only selected child.
      if (isTheOnlySelectedChildRow) {
        return key !== `${parentRowIndex}`;
      }

      return true;
    });

  return Object.fromEntries(newSelectedItems);
}

export function getTotalSelectedChildRows<T>({
  childrenRows,
  parentRowIndex,
  selectedItems,
  // rowId,
  parentRowId,
  getRowId,
}: SelectRowArg<T>) {
  // TODO: check this
  if (parentRowId !== undefined && getRowId !== undefined) {
    return childrenRows?.reduce((acc, childRow) => {
      const childRowId = getRowId(childRow);

      if (selectedItems[childRowId] !== undefined) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }

  return childrenRows?.reduce((acc, _childRow, childRowIndex) => {
    if (selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined) {
      return acc + 1;
    }

    return acc;
  }, 0);
}
