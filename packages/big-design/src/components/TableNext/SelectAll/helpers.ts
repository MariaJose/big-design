import { TableProps, TableSelectable } from '../types';

export function getTotalSelectedItems<T>(
  items: T[],
  selectedItems: TableSelectable['selectedItems'],
) {
  return items.reduce((acc, _parentRow, parentRowIndex) => {
    if (selectedItems[parentRowIndex] !== undefined) {
      return acc + 1;
    }

    return acc;
  }, 0);
}

export function getChildrenRows<T>(
  expandedRowSelector: TableProps<T>['expandedRowSelector'],
  parentRow: T,
) {
  const expandedRowMode = expandedRowSelector !== undefined;

  if (!expandedRowMode) {
    return [];
  }

  return expandedRowSelector(parentRow) ?? [];
}

export function areAllInPageSelected<T>(
  expandedRowSelector: TableProps<T>['expandedRowSelector'],
  isExpandable: boolean,
  items: T[],
  selectedItems: TableSelectable['selectedItems'],
) {
  return (
    items.length > 0 &&
    items.every((parentRow, parentRowIndex) => {
      const childrenRows: T[] = getChildrenRows(expandedRowSelector, parentRow);

      if (!isExpandable || childrenRows.length === 0) {
        return selectedItems[parentRowIndex] !== undefined;
      }

      const allChildrenRowsSelected = childrenRows.every((_childRow, childRowIndex) => {
        return selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;
      });

      return selectedItems[parentRowIndex] !== undefined && allChildrenRowsSelected;
    })
  );
}

export function areSomeInPageSelected<T>(
  expandedRowSelector: TableProps<T>['expandedRowSelector'],
  isExpandable: boolean,
  items: T[],
  selectedItems: TableSelectable['selectedItems'],
) {
  return (
    items.length > 0 &&
    items.some((parentRow, parentRowIndex) => {
      const childrenRows: T[] = getChildrenRows(expandedRowSelector, parentRow);

      if (!isExpandable || childrenRows.length === 0) {
        return selectedItems[parentRowIndex] !== undefined;
      }

      const someChildrenRowsInPageSelected = childrenRows.some((_childRow, childRowIndex) => {
        return selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;
      });

      return selectedItems[parentRowIndex] !== undefined && someChildrenRowsInPageSelected;
    })
  );
}

export function selectAll<T>(
  expandedRowSelector: TableProps<T>['expandedRowSelector'],
  isExpandable: boolean,
  items: T[],
  selectedItems: TableSelectable['selectedItems'],
) {
  items.forEach((parentRow, parentRowIndex) => {
    delete selectedItems[parentRowIndex];

    if (isExpandable) {
      const childrenRows = getChildrenRows(expandedRowSelector, parentRow);

      childrenRows.forEach((_childRow, childRowIndex) => {
        delete selectedItems[`${parentRowIndex}.${childRowIndex}`];
      });
    }
  });
}

export function unselectAll<T>(
  expandedRowSelector: TableProps<T>['expandedRowSelector'],
  isExpandable: boolean,
  items: T[],
  selectedItems: TableSelectable['selectedItems'],
) {
  items.forEach((parentRow, parentRowIndex) => {
    selectedItems[`${parentRowIndex}`] = true;

    if (isExpandable) {
      const childrenRows = getChildrenRows(expandedRowSelector, parentRow);

      childrenRows.forEach((_childRow, childRowIndex) => {
        if (selectedItems[`${parentRowIndex}.${childRowIndex}`] === undefined) {
          selectedItems[`${parentRowIndex}.${childRowIndex}`] = true;
        }
      });
    }
  });
}
