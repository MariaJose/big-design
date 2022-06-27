import { TableProps, TableSelectable } from '../types';

import {
  areAllInPageSelected,
  areSomeInPageSelected,
  getTotalSelectedItems,
  selectAll,
  unselectAll,
} from './helpers';

export const useSelectAllState = <T>(
  expandedRowSelector: TableProps<T>['expandedRowSelector'],
  isExpandable: boolean,
  items: T[],
  selectedItems: TableSelectable['selectedItems'],
  onChange?: TableSelectable['onSelectionChange'],
) => {
  const allInPageSelected = areAllInPageSelected(
    expandedRowSelector,
    isExpandable,
    items,
    selectedItems,
  );

  const someInPageSelected = areSomeInPageSelected(
    expandedRowSelector,
    isExpandable,
    items,
    selectedItems,
  );

  const totalSelectedItems = getTotalSelectedItems(items, selectedItems);
  const label = allInPageSelected ? 'Deselect All' : 'Select All';

  const handleSelectAll = () => {
    if (typeof onChange !== 'function') {
      return;
    }

    const newSelectedItems = { ...selectedItems };

    if (allInPageSelected) {
      selectAll(expandedRowSelector, isExpandable, items, newSelectedItems);

      return onChange(newSelectedItems);
    }

    unselectAll(expandedRowSelector, isExpandable, items, newSelectedItems);

    return onChange(newSelectedItems);
  };

  return {
    allInPageSelected,
    handleSelectAll,
    label,
    someInPageSelected,
    totalSelectedItems,
  };
};
