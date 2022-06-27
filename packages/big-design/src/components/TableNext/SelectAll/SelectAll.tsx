import React from 'react';

import { Checkbox } from '../../Checkbox';
import { Flex, FlexItem } from '../../Flex';
import { Text } from '../../Typography';
import { TableItem, TablePaginationProps, TableProps, TableSelectable } from '../types';

import { useSelectAllState } from './useSelectAllState';

export interface SelectAllProps<T> {
  items: T[];
  totalItems: number;
  onChange?: TableSelectable['onSelectionChange'];
  pagination?: TablePaginationProps;
  selectedItems: TableSelectable['selectedItems'];
  expandedRowSelector: TableProps<T>['expandedRowSelector'];
  isExpandable: boolean;
}

export const SelectAll = <T extends TableItem>({
  items = [],
  onChange,
  selectedItems,
  totalItems,
  isExpandable,
  expandedRowSelector,
}: SelectAllProps<T>) => {
  const { allInPageSelected, handleSelectAll, label, someInPageSelected, totalSelectedItems } =
    useSelectAllState(expandedRowSelector, isExpandable, items, selectedItems, onChange);

  return (
    <FlexItem flexShrink={0} marginRight="xxSmall">
      <Flex flexDirection="row">
        <Checkbox
          checked={allInPageSelected}
          hiddenLabel
          isIndeterminate={someInPageSelected}
          label={label}
          onChange={handleSelectAll}
        />
        <Text marginLeft="small">
          {totalSelectedItems === 0 ? `${totalItems}` : `${totalSelectedItems}/${totalItems}`}
        </Text>
      </Flex>
    </FlexItem>
  );
};
