import React, { Dispatch, SetStateAction } from 'react';

import { Checkbox } from '../../Checkbox';
import { Flex, FlexItem } from '../../Flex';
import { Text } from '../../Typography';
// import { ActionsProps } from '../Actions';
// import { TableItem, TablePaginationProps, TableSelectable } from '../types';
import { TableExpandable, TableItem, TablePaginationProps, TableSelectable } from '../types';

import { useSelectAllState } from './useSelectAllState';

export interface SelectAllProps<T> {
  expandedRowSelector?: TableExpandable<T>['expandedRowSelector'];
  isExpandable: boolean;
  items: T[];
  onChange?: TableSelectable['onSelectionChange'];
  selectedItems: TableSelectable['selectedItems'];
  totalItems: number;
  pagination?: TablePaginationProps;
  // TODO: check types
  getRowId?: (item: T) => string;
  // selectedItemsRecord: ActionsProps<T>['selectedItemsRecord'];
  setSelectedItemsRecord: Dispatch<SetStateAction<Set<string>>>;
  // selectedItemsRecord: Set<string> | undefined;
  selectedItemsRecord: Set<string>;
}

export const SelectAll = <T extends TableItem>(props: SelectAllProps<T>) => {
  const { allInPageSelected, handleSelectAll, label, someInPageSelected, totalSelectedItems } =
    useSelectAllState(props);

  const { totalItems } = props;

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
