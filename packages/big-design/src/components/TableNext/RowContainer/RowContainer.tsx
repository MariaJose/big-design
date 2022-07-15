import React, { forwardRef } from 'react';

import { typedMemo } from '../../../utils';
import { Box } from '../../Box';
import { DataCell } from '../DataCell';
import { Row, RowProps } from '../Row';
import { TableExpandable, TableItem } from '../types';

interface InternalRowContainerProps<T>
  extends Omit<RowProps<T>, 'isSelected' | 'isParentRows' | 'childrenRows' | 'isDraggable'> {
  expandedRows: TableExpandable<T>['expandedRows'];
  expandedRowSelector?: TableExpandable<T>['expandedRowSelector'];
  getItemKey: (item: T, index: number) => string | number;
  headerless?: boolean;
  renderHelperRow?: TableExpandable<T>['render'];
}

interface PrivateProps {
  forwardedRef?: React.Ref<HTMLTableRowElement>;
}

const InternalRowContainer = <T extends TableItem>({
  isDragging,
  columns,
  expandedRows,
  forwardedRef,
  headerCellWidths,
  isExpandable = false,
  isSelectable = false,
  item,
  parentRowIndex,
  showDragIcon,
  renderHelperRow: HelperRow,
  expandedRowSelector,
  getItemKey,
  onItemSelect,
  onExpandedRow,
  selectedItems,
  ...rest
}: InternalRowContainerProps<T> & PrivateProps) => {
  const isParentRowSelected = selectedItems[parentRowIndex] !== undefined;
  const isExpanded = expandedRows[parentRowIndex] !== undefined;
  const childrenRows: T[] | undefined = expandedRowSelector ? expandedRowSelector(item) : [];
  const isDraggable: boolean = showDragIcon === true;
  const hasHelperRowComponent = HelperRow !== undefined;

  return (
    <>
      <Row
        childrenRows={childrenRows ?? []}
        columns={columns}
        headerCellWidths={headerCellWidths}
        isDraggable={isDraggable}
        isDragging={isDragging}
        isExpandable={isExpandable}
        isExpanded={isExpanded}
        isParentRow={true}
        isSelectable={isSelectable}
        isSelected={isParentRowSelected}
        item={item}
        onExpandedRow={onExpandedRow}
        onItemSelect={onItemSelect}
        parentRowIndex={parentRowIndex}
        ref={forwardedRef}
        selectedItems={selectedItems}
        showDragIcon={showDragIcon}
        {...rest}
      />
      {expandedRowSelector &&
        isExpanded &&
        expandedRowSelector(item)?.map((childRow: T, childRowIndex: number) => {
          const key = getItemKey(childRow, childRowIndex);
          const isChildRowSelected =
            selectedItems[`${parentRowIndex}.${childRowIndex}`] !== undefined;

          return (
            <Row
              childRowIndex={childRowIndex}
              childrenRows={childrenRows ?? []}
              columns={columns}
              headerCellWidths={headerCellWidths}
              isDraggable={isDraggable}
              isDragging={false}
              isExpandable={isExpandable}
              isParentRow={false}
              isSelectable={isSelectable}
              isSelected={isChildRowSelected}
              item={childRow}
              key={key}
              onItemSelect={onItemSelect}
              parentRowIndex={parentRowIndex}
              selectedItems={selectedItems}
              showDragIcon={showDragIcon}
            />
          );
        })}
      {isExpanded &&
        childrenRows !== undefined &&
        childrenRows.length > 0 &&
        hasHelperRowComponent && (
          <tr key={`extra-helper-row-${parentRowIndex}`}>
            <DataCell
              // align={align}
              // display={display}
              // key={columnIndex}
              // verticalAlign={verticalAlign}
              colSpan={10000}
              width={100}

              // withPadding={withPadding}
            >
              <Box display="flex">
                {/* {columnIndex === 0 && isExpandable && isSelectable && !isParentRow && (
              <Checkbox
                checked={isSelected}
                hiddenLabel
                label={label}
                onChange={onChange}
                width={0}
              />
            )} */}
                {/*
// @ts-expect-error https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544 */}
                <HelperRow parentRowIndex={parentRowIndex} />
              </Box>
            </DataCell>
          </tr>
        )}
    </>
  );
};

export const RowContainer = typedMemo(
  forwardRef<HTMLTableRowElement, InternalRowContainerProps<any>>((props, ref) => (
    <InternalRowContainer {...props} forwardedRef={ref} />
  )),
);
