import React from 'react';
import 'jest-styled-components';

import { render, screen } from '@test/utils';

import { TableColumn } from '../types';

import { Row } from './Row';
import { useRowState } from './useRowState';

interface Item {
  sku: string;
  name: string;
  stock: number;
  children?: Item[];
}

const item = { sku: 'SM13', name: '[Sample] Smith Journal 13', stock: 25 };

const defaultColumns: Array<TableColumn<Item>> = [
  { hash: 'sku', header: 'Sku', render: ({ sku }) => sku },
  { hash: 'name', header: 'Name', render: ({ name }) => name },
  { hash: 'stock', header: 'Stock', render: ({ stock }) => stock },
];

const defaultGetRowId = (_row: Item, parentRowIndex: number) => `${parentRowIndex}`;

test('renders a table row', async () => {
  render(
    <table>
      <tbody>
        <Row
          childrenRowsIds={[]}
          columns={defaultColumns}
          getRowId={defaultGetRowId}
          headerCellWidths={[]}
          isDraggable={false}
          item={item}
          parentRowId="0"
          parentRowIndex={0}
          selectedItems={{}}
        />
      </tbody>
    </table>,
  );

  const name = await screen.findByRole('row', { name: /Smith Journal 13/i });

  expect(name).toBeVisible();
});

test('row state callbacks execute argument callback', () => {
  const onExpandedRow = jest.fn();
  const onItemSelect = jest.fn();

  const { onChange, onExpandedChange } = useRowState({
    isExpandable: true,
    isParentRow: true,
    isSelected: false,
    selectedItems: {},
    onExpandedRow,
    onItemSelect,
    parentRowIndex: 0,
    isChildrenRowsSelectable: false,
    childrenRowsIds: [],
    parentRowId: '0',
  });

  onChange();

  expect(onItemSelect).toHaveBeenCalled();

  onExpandedChange();

  expect(onExpandedRow).toHaveBeenCalled();
});
