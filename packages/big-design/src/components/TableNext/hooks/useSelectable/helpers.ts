import { Dispatch, SetStateAction } from 'react';

import { TableSelectable } from '../../types';

export interface SelectRowArg {
  childRowIndex?: number | null;
  isExpandable?: boolean;
  isTheOnlySelectedChildRow?: boolean;
  parentRowIndex: number;
  selectedItems: TableSelectable['selectedItems'];
  isParentRow?: boolean;
  parentRowId: string;
  setSelectedParentRowsCrossPages: Dispatch<SetStateAction<Set<string>>>;
  childRowId?: string;
  isChildrenRowsSelectable?: TableSelectable['isChildrenRowsSelectable'];
  childrenRowsIds: string[];
}

export function selectParentRow({
  isExpandable,
  parentRowIndex,
  selectedItems,
  setSelectedParentRowsCrossPages,
  childRowId,
  parentRowId,
  isChildrenRowsSelectable,
  childrenRowsIds,
}: SelectRowArg): TableSelectable['selectedItems'] {
  const parentRow = parentRowId !== undefined ? parentRowId : parentRowIndex;
  const isSelectedParent = selectedItems[parentRow] !== undefined;

  if (isSelectedParent) {
    const newSelectedItems = unselectParent({
      isExpandable,
      parentRowIndex,
      selectedItems,
      setSelectedParentRowsCrossPages,
      childRowId,
      parentRowId,
      isChildrenRowsSelectable,
      childrenRowsIds,
    });

    return newSelectedItems;
  }

  const newSelectedItems = selectParent({
    isExpandable,
    parentRowIndex,
    selectedItems,
    parentRowId,
    setSelectedParentRowsCrossPages,
    childRowId,
    isChildrenRowsSelectable,
    childrenRowsIds,
  });

  return newSelectedItems;
}

function unselectParent({
  isExpandable,
  parentRowIndex,
  selectedItems,
  parentRowId,
  setSelectedParentRowsCrossPages,
  childRowId,
  isChildrenRowsSelectable,
  childrenRowsIds,
}: SelectRowArg): TableSelectable['selectedItems'] {
  const hasChildrenRows = isExpandable && childrenRowsIds.length;

  // If parent has children, unselect it's childrenRows
  if (hasChildrenRows && isChildrenRowsSelectable) {
    const newSelectedItems = unselectParentAndChildren({
      selectedItems,
      parentRowIndex,
      parentRowId,
      setSelectedParentRowsCrossPages,
      childRowId,
      childrenRowsIds,
    });

    return newSelectedItems;
  }

  setSelectedParentRowsCrossPages((prevSelectedRecords) => {
    const newSet = new Set([...prevSelectedRecords]);

    newSet.delete(parentRowId);

    return newSet;
  });

  // Unselect the parent row
  const newSelectedItems = Object.entries(selectedItems).filter(([key]) => {
    return key !== parentRowId;
  });

  return Object.fromEntries(newSelectedItems);
}

function unselectParentAndChildren({
  selectedItems,
  parentRowId,
  setSelectedParentRowsCrossPages,
  childrenRowsIds,
}: SelectRowArg) {
  setSelectedParentRowsCrossPages((prevSelectedRecords) => {
    const newSet = new Set([...prevSelectedRecords]);

    newSet.delete(parentRowId);

    return newSet;
  });

  const newSelectedItems = { ...selectedItems };

  delete newSelectedItems[parentRowId];

  childrenRowsIds?.forEach((childRowId) => {
    delete newSelectedItems[childRowId];
  });

  return newSelectedItems;
}

function selectParent({
  isExpandable,
  parentRowIndex,
  selectedItems,
  parentRowId,
  setSelectedParentRowsCrossPages,
  childRowId,
  isChildrenRowsSelectable,
  childrenRowsIds,
}: SelectRowArg): TableSelectable['selectedItems'] {
  const hasChildrenRows = isExpandable && childrenRowsIds.length;

  // If parent has children, select it's childrenRows
  if (hasChildrenRows && isChildrenRowsSelectable) {
    const newSelectedItems = selectParentAndChildren({
      selectedItems,
      parentRowIndex,
      parentRowId,
      childRowId,
      setSelectedParentRowsCrossPages,
      childrenRowsIds,
    });

    return newSelectedItems;
  }

  setSelectedParentRowsCrossPages((prevSelectedRecords) => {
    const newSet = new Set([...prevSelectedRecords]);

    newSet.add(parentRowId);

    return newSet;
  });

  return {
    ...selectedItems,
    [parentRowId]: true,
  };
}

function selectParentAndChildren({
  selectedItems,
  parentRowId,
  setSelectedParentRowsCrossPages,
  childrenRowsIds,
}: SelectRowArg) {
  setSelectedParentRowsCrossPages((prevSelectedRecords) => {
    const newSet = new Set([...prevSelectedRecords]);

    newSet.add(parentRowId);

    return newSet;
  });

  const newSelectedItems = { ...selectedItems };

  newSelectedItems[parentRowId] = true;

  childrenRowsIds?.forEach((childRowId) => {
    newSelectedItems[childRowId] = true;
  });

  return newSelectedItems;
}

export function selectChildRow({
  childRowId,
  childRowIndex,
  isTheOnlySelectedChildRow,
  selectedItems,
  parentRowIndex,
  parentRowId,
  setSelectedParentRowsCrossPages,
  childrenRowsIds,
}: SelectRowArg): TableSelectable['selectedItems'] {
  const isSelectedParent = selectedItems[parentRowId] !== undefined;

  if (!isSelectedParent) {
    const newSelectedItems = selectChild({
      childRowIndex,
      parentRowIndex,
      selectedItems,
      parentRowId,
      childRowId,
      setSelectedParentRowsCrossPages,
      childrenRowsIds,
    });

    return newSelectedItems;
  }

  const isSelectedChild = childRowId !== undefined && selectedItems[childRowId];

  if (isSelectedChild) {
    const newSelectedItems = unselectChild({
      selectedItems,
      parentRowIndex,
      childRowIndex,
      isTheOnlySelectedChildRow,
      setSelectedParentRowsCrossPages,
      parentRowId,
      childRowId,
      childrenRowsIds,
    });

    return newSelectedItems;
  }

  // SelectedParent but child is not selected.
  const newSelectedItems = { ...selectedItems };

  newSelectedItems[`${childRowId}`] = true;

  return newSelectedItems;
}

function selectChild({
  selectedItems,
  parentRowId,
  setSelectedParentRowsCrossPages,
  childRowId,
}: SelectRowArg): TableSelectable['selectedItems'] {
  const newSelectedItems = { ...selectedItems };

  setSelectedParentRowsCrossPages((prevSelectedRecords) => {
    const newSet = new Set([...prevSelectedRecords]);

    newSet.add(parentRowId);

    return newSet;
  });

  newSelectedItems[`${parentRowId}`] = true;
  newSelectedItems[`${childRowId}`] = true;

  return newSelectedItems;
}

function unselectChild({
  selectedItems,
  isTheOnlySelectedChildRow,
  setSelectedParentRowsCrossPages,
  parentRowId,
  childRowId,
}: SelectRowArg) {
  const newSelectedItems = Object.entries(selectedItems)
    .filter(([key]) => key !== `${childRowId}`)
    .filter(([key]) => {
      // Remove the parent row if it's the only selected child.
      if (isTheOnlySelectedChildRow) {
        setSelectedParentRowsCrossPages((prevSelectedRecords) => {
          const newSet = new Set([...prevSelectedRecords]);

          newSet.delete(parentRowId);

          return newSet;
        });

        return key !== `${parentRowId}`;
      }

      return true;
    });

  return Object.fromEntries(newSelectedItems);
}

export function getTotalSelectedChildRows({ selectedItems, childrenRowsIds }: SelectRowArg) {
  // TODO: check this
  return childrenRowsIds?.reduce((acc, childRowId) => {
    if (selectedItems[childRowId] !== undefined) {
      return acc + 1;
    }

    return acc;
  }, 0);
}
