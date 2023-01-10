import { getPagedIndex } from '../helpers';
import { TableExpandable, TableSelectable } from '../types';

import { SelectAllProps } from './SelectAll';

type SelectAllRowsArg<T> = Omit<SelectAllProps<T>, 'onChange'>;

export function getChildrenRows<T>(
  parentRow: T,
  expandedRowSelector?: TableExpandable<T>['expandedRowSelector'],
) {
  const expandedRowMode = expandedRowSelector !== undefined;

  if (!expandedRowMode) {
    return [];
  }

  return expandedRowSelector(parentRow) ?? [];
}

export function areAllInPageSelected<T>({
  items,
  selectedItems,
  expandedRowSelector,
  pagination,
  getRowId,
  isChildrenRowsSelectable,
}: SelectAllRowsArg<T>) {
  if (items.length === 0) {
    return false;
  }

  return items.every((parentRow, parentRowIndex) => {
    const pagedIndex = getPagedIndex(parentRowIndex, pagination);
    const childrenRows: T[] = getChildrenRows(parentRow, expandedRowSelector);
    const childrenRowsIds: string[] = childrenRows.map((childRow, childRowIndex) => {
      return getRowId(childRow, pagedIndex, childRowIndex);
    });
    const parentRowId = getRowId(parentRow, pagedIndex);

    // Not need to check childrens since expandable mode is not used.
    if (childrenRowsIds.length === 0 || !isChildrenRowsSelectable) {
      return selectedItems[parentRowId];
    }

    return areAllParentsAndChildrenSelected(selectedItems, childrenRowsIds, parentRowId);
  });
}

export function areSomeInPageSelected<T>({
  items,
  selectedItems,
  expandedRowSelector,
  pagination,
  getRowId,
  isChildrenRowsSelectable,
}: SelectAllRowsArg<T>): boolean {
  if (items.length <= 0) {
    return false;
  }

  return items.some((parentRow, parentRowIndex) => {
    const pagedIndex = getPagedIndex(parentRowIndex, pagination);
    const childrenRows: T[] = getChildrenRows(parentRow, expandedRowSelector);
    const childrenRowsIds: string[] = childrenRows.map((childRow, childRowIndex) => {
      return getRowId(childRow, pagedIndex, childRowIndex);
    });
    const parentRowId = getRowId(parentRow, pagedIndex);

    if (childrenRowsIds.length === 0 || !isChildrenRowsSelectable) {
      return selectedItems[parentRowId] !== undefined;
    }

    return areSomeParentsAndChildrenSelected(selectedItems, childrenRowsIds, parentRowId);
  });
}

function areAllParentsAndChildrenSelected(
  selectedItems: TableSelectable['selectedItems'],
  childrenRowsIds: string[],
  parentRowId: string,
) {
  // Parent with no children
  if (childrenRowsIds.length === 0) {
    return selectedItems[parentRowId] !== undefined;
  }

  const allChildrenRowsSelected = childrenRowsIds.every((childRowId) => {
    return selectedItems[childRowId];
  });

  return selectedItems[parentRowId] !== undefined && allChildrenRowsSelected;
}

function areSomeParentsAndChildrenSelected(
  selectedItems: TableSelectable['selectedItems'],
  childrenRowsIds: string[],
  parentRowId: string,
) {
  // Parent with no children
  if (childrenRowsIds.length === 0) {
    return selectedItems[parentRowId] !== undefined;
  }

  const someChildrenRowsInPageSelected = childrenRowsIds.some((childRowId) => {
    return selectedItems[childRowId] !== undefined;
  });

  return selectedItems[parentRowId] !== undefined && someChildrenRowsInPageSelected;
}

function deselectAllOnCurrentPage<T>(params: SelectAllRowsArg<T>) {
  const {
    items,
    selectedItems,
    pagination,
    getRowId,
    expandedRowSelector,
    setSelectedParentRowsCrossPages,
  } = params;

  const newSelectedItems = { ...selectedItems };

  items.forEach((item, index) => {
    const pagedIndex = getPagedIndex(index, pagination);
    const parentRowId = getRowId(item, pagedIndex);

    setSelectedParentRowsCrossPages((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.delete(parentRowId);

      return newSet;
    });

    delete newSelectedItems[parentRowId];

    const childrenRows = getChildrenRows(item, expandedRowSelector);

    childrenRows.forEach((childRow, childRowIndex) => {
      const childRowId = getRowId(childRow, pagedIndex, childRowIndex);

      delete newSelectedItems[childRowId];
    });
  });

  return newSelectedItems;
}

function selectAllOnCurrentPage<T>(params: SelectAllRowsArg<T>) {
  const {
    items,
    selectedItems,
    expandedRowSelector,
    pagination,
    getRowId,
    setSelectedParentRowsCrossPages,
    isChildrenRowsSelectable,
  } = params;
  const newSelectedItems = items.map((parentRow, parentRowIndex) => {
    const pagedIndex = getPagedIndex(parentRowIndex, pagination);
    const childrenRows: T[] = getChildrenRows(parentRow, expandedRowSelector);
    const parentRowId = getRowId(parentRow, pagedIndex);

    // Select parents record to check select all
    setSelectedParentRowsCrossPages((prevSelectedRecords) => {
      const newSet = new Set([...prevSelectedRecords]);

      newSet.add(parentRowId);

      return newSet;
    });

    if (isChildrenRowsSelectable) {
      const newSelectedChildrenRows = childrenRows.map<[string, true]>((child, childRowIndex) => {
        const childRowId = getRowId(child, pagedIndex, childRowIndex);

        return [`${childRowId}`, true];
      });

      return [[`${parentRowId}`, true], ...newSelectedChildrenRows];
    }

    return [[`${parentRowId}`, true]];
  });

  return { ...selectedItems, ...Object.fromEntries(newSelectedItems.flat()) };
}

export function getSelectAllState<T>(
  params: SelectAllRowsArg<T>,
): TableSelectable['selectedItems'] {
  if (areAllInPageSelected(params)) {
    return deselectAllOnCurrentPage(params);
  }

  return selectAllOnCurrentPage(params);
}
