import { getPagedIndex } from '../helpers';
import { TableExpandable, TableSelectable } from '../types';

import { SelectAllProps } from './SelectAll';

type SelectAllRowsArg<T> = Omit<SelectAllProps<T>, 'onChange'>;

export function getTotalSelectedItems<T>({
  items,
  selectedItems,
  // TODO: check this later
  getRowId,
}: // selectedItemsRecord,
// setSelectedItemsRecord,
SelectAllRowsArg<T>) {
  // TODO: check this later
  if (getRowId) {
    const totalSelectedItems = items.reduce((acc, item) => {
      if (selectedItems[getRowId(item)]) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return totalSelectedItems;
  }

  return Object.keys(selectedItems).filter((key) => !key.includes('.')).length;
}

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
  isExpandable,
  items,
  selectedItems,
  expandedRowSelector,
  pagination,
  getRowId,
}: SelectAllRowsArg<T>) {
  if (items.length <= 0) {
    return false;
  }

  return items.every((parentRow, parentRowIndex) => {
    const pagedIndex = getPagedIndex(parentRowIndex, pagination);
    const childrenRows: T[] = getChildrenRows(parentRow, expandedRowSelector);

    // Not need to check childrens since expandable mode is not used.
    if (!isExpandable || childrenRows.length === 0) {
      // TODO: check this
      if (getRowId !== undefined) {
        return selectedItems[getRowId(parentRow)] !== undefined;
      }

      return selectedItems[pagedIndex] !== undefined;
    }

    return areAllParentsAndChildrenSelected(
      childrenRows,
      selectedItems,
      pagedIndex,
      parentRow,
      getRowId,
    );
  });
}

export function areSomeInPageSelected<T>({
  isExpandable,
  items,
  selectedItems,
  expandedRowSelector,
  pagination,
  getRowId,
}: SelectAllRowsArg<T>): boolean {
  if (items.length <= 0) {
    return false;
  }

  return items.some((parentRow, parentRowIndex) => {
    const pagedIndex = getPagedIndex(parentRowIndex, pagination);
    const childrenRows: T[] = getChildrenRows(parentRow, expandedRowSelector);

    // Not need to check childrens since expandable mode is not used.
    if (!isExpandable || childrenRows.length === 0) {
      if (getRowId !== undefined) {
        return selectedItems[getRowId(parentRow)] !== undefined;
      }

      return selectedItems[pagedIndex] !== undefined;
    }

    return areSomeParentsAndChildrenSelected(
      childrenRows,
      selectedItems,
      pagedIndex,
      parentRow,
      getRowId,
    );
  });
}

function areAllParentsAndChildrenSelected<T>(
  childrenRows: T[],
  selectedItems: TableSelectable['selectedItems'],
  pagedIndex: number,
  parentRow: T,
  getRowId?: (item: T) => string,
) {
  // TODO: update this
  const allChildrenRowsSelected = childrenRows.every((childRow, childRowIndex) => {
    if (getRowId !== undefined) {
      const childRowId = getRowId(childRow);

      return selectedItems[childRowId] !== undefined;
    }

    return selectedItems[`${pagedIndex}.${childRowIndex}`] !== undefined;
  });

  if (getRowId !== undefined) {
    return selectedItems[getRowId(parentRow)] !== undefined && allChildrenRowsSelected;
  }

  return selectedItems[pagedIndex] !== undefined && allChildrenRowsSelected;
}

function areSomeParentsAndChildrenSelected<T>(
  childrenRows: T[],
  selectedItems: TableSelectable['selectedItems'],
  pagedIndex: number,
  parentRow: T,
  getRowId?: (item: T) => string,
) {
  const someChildrenRowsInPageSelected = childrenRows.some((childRow, childRowIndex) => {
    if (getRowId !== undefined) {
      return selectedItems[getRowId(childRow)] !== undefined;
    }

    return selectedItems[`${pagedIndex}.${childRowIndex}`] !== undefined;
  });

  if (getRowId !== undefined) {
    return selectedItems[getRowId(parentRow)] !== undefined && someChildrenRowsInPageSelected;
  }

  return selectedItems[pagedIndex] !== undefined && someChildrenRowsInPageSelected;
}

function deselectAllOnCurrentPage<T>(params: SelectAllRowsArg<T>) {
  const {
    items,
    selectedItems,
    pagination,
    getRowId,
    expandedRowSelector,
    setSelectedItemsRecord,
  } = params;

  if (getRowId !== undefined && pagination !== undefined) {
    const newSelectedItems = { ...selectedItems };

    items.forEach((item) => {
      delete newSelectedItems[getRowId(item)];

      setSelectedItemsRecord((prevSelectedRecords) => {
        const newSet = new Set([...prevSelectedRecords]);

        newSet.delete(getRowId(item));

        return newSet;
      });

      const childrenRows = getChildrenRows(item, expandedRowSelector);

      childrenRows.forEach((childRow) => {
        delete newSelectedItems[getRowId(childRow)];
      });
    });

    return newSelectedItems;
  }

  const filteredSelectedItems = Object.keys(selectedItems)
    .filter((selectedKey) => {
      const [parentIndex] = selectedKey.split('.').map((key) => parseInt(key, 10));
      const item = items.find((_, index) => getPagedIndex(index, pagination) === parentIndex);

      return !item;
    })
    .map<[string, true]>((key) => [key, true]);

  return Object.fromEntries(filteredSelectedItems);
}

function selectAllOnCurrentPage<T>(params: SelectAllRowsArg<T>) {
  const {
    isExpandable,
    items,
    selectedItems,
    expandedRowSelector,
    pagination,
    getRowId,
    setSelectedItemsRecord,
  } = params;
  const newSelectedItems = items.map((parentRow, parentRowIndex) => {
    const pagedIndex = getPagedIndex(parentRowIndex, pagination);
    const childrenRows: T[] = getChildrenRows(parentRow, expandedRowSelector);

    // Select parents record to check select all
    if (getRowId !== undefined) {
      setSelectedItemsRecord((prevSelectedRecords) => {
        const newSet = new Set([...prevSelectedRecords]);

        newSet.add(getRowId(parentRow));

        return newSet;
      });
    }

    if (isExpandable) {
      const newSelectedChildrenRows = childrenRows.map<[string, true]>((child, childRowIndex) => {
        if (getRowId !== undefined) {
          return [getRowId(child), true];
        }

        return [`${pagedIndex}.${childRowIndex}`, true];
      });

      if (getRowId !== undefined) {
        return [[getRowId(parentRow), true], ...newSelectedChildrenRows];
      }

      return [[`${pagedIndex}`, true], ...newSelectedChildrenRows];
    }

    if (getRowId !== undefined) {
      return [[`${getRowId(parentRow)}`, true]];
    }

    return [[`${pagedIndex}`, true]];
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
