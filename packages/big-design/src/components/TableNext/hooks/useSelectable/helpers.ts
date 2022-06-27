import { TableSelectable } from '../../types';

export function selectParentRow<T>(
  childrenRows: T[],
  isExpandable: boolean,
  isSelectedParent: boolean,
  onSelectionChange: TableSelectable['onSelectionChange'],
  parentRowIndex: number,
  selectedItems: TableSelectable['selectedItems'],
) {
  if (isSelectedParent) {
    delete selectedItems[parentRowIndex];

    if (isExpandable) {
      for (let index = 0; index < childrenRows.length; index++) {
        const childRowIndex = index;

        delete selectedItems[`${parentRowIndex}.${childRowIndex}`];
      }
    }

    onSelectionChange(selectedItems);
  } else {
    selectedItems[parentRowIndex] = true;

    if (isExpandable) {
      for (let index = 0; index < childrenRows.length; index++) {
        const childRowIndex = index;

        selectedItems[`${parentRowIndex}.${childRowIndex}`] = true;
      }
    }

    onSelectionChange(selectedItems);
  }
}

export function selectChildRow(
  childRowIndex: number,
  isSelectedParent: boolean,
  isTheOnlySelectedChildRow: boolean,
  onSelectionChange: TableSelectable['onSelectionChange'],
  parentRowIndex: number,
  selectedItems: TableSelectable['selectedItems'],
) {
  if (!isSelectedParent) {
    selectedItems[`${parentRowIndex}`] = true;
    selectedItems[`${parentRowIndex}.${childRowIndex}`] = true;

    onSelectionChange(selectedItems);

    return;
  }

  const isSelectedChild = selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;

  if (isSelectedChild) {
    delete selectedItems[`${parentRowIndex}.${childRowIndex}`];

    if (isTheOnlySelectedChildRow) {
      delete selectedItems[`${parentRowIndex}`];
    }

    onSelectionChange(selectedItems);
  } else {
    selectedItems[`${parentRowIndex}.${childRowIndex}`] = true;

    onSelectionChange(selectedItems);
  }
}

export function getTotalSelectedChildRows<T>(
  childrenRows: T[],
  parentRowIndex: number,
  selectedItems: TableSelectable['selectedItems'],
) {
  return childrenRows.reduce((acc, _childRow, childRowIndex) => {
    if (selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined) {
      return acc + 1;
    }

    return acc;
  }, 0);
}
