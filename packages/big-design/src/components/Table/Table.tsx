import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { useEventCallback, useUniqueId } from '../../hooks';
import { MarginProps } from '../../mixins';
import { typedMemo } from '../../utils';

import { Actions } from './Actions';
import { Body } from './Body';
import { Head } from './Head';
import { HeaderCell } from './HeaderCell';
import { DragIconHeaderCell, HeaderCheckboxCell } from './HeaderCell/HeaderCell';
import { Row } from './Row';
import { StyledTable, StyledTableFigure } from './styled';
import { TableColumn, TableItem, TableProps } from './types';

const InternalTable = <T extends TableItem>(props: TableProps<T>): React.ReactElement<TableProps<T>> => {
  const {
    actions,
    className,
    columns,
    emptyComponent,
    headerless = false,
    id,
    itemName,
    items,
    keyField = 'id',
    onRowDrop,
    pagination,
    selectable,
    sortable,
    stickyHeader,
    style,
    ...rest
  } = props;

  // TODO: check if this would be better to live outside. Had to put it inside the component because of TS (genetal T).
  const table = createTable().setRowType<T>();
  const actionsRef = useRef<HTMLDivElement>(null);
  const uniqueTableId = useUniqueId('table');
  const tableIdRef = useRef(id || uniqueTableId);
  const isSelectable = Boolean(selectable);
  const [selectedItems, setSelectedItems] = useState<Set<T>>(new Set());
  const [headerCellWidths, setHeaderCellWidths] = useState<Array<number | string>>([]);
  const headerCellIconRef = useRef<HTMLTableCellElement>(null);

  // TODO: Fix TS type
  const columnsReactTable = useMemo(() => {
    return columns.map((column) => {
      return table.createDataColumn(column.hash, {
        header: column.header,
        meta: { ...column },
        // cell: (props) => console.log(props.getValue(), 'here the info'),
      } as any);
    });
  }, [columns, table]);

  // TODO: check if we should implement sorting react table functionality.
  // TODO: check if we should implement select react table functionality.
  // TODO: check if we should implement pagination react table functionality.
  const instanceReactTable = useTableInstance(table, {
    data: items,
    columns: columnsReactTable,
    manualSorting: false,
    manualPagination: true,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const eventCallback = useEventCallback((item: T) => {
    if (!selectable || !item) {
      return;
    }

    const { onSelectionChange } = selectable;
    const nextIsSelected = !selectedItems.has(item);

    if (nextIsSelected) {
      onSelectionChange([...selectedItems, item]);
    } else {
      onSelectionChange([...selectedItems].filter((selectedItem) => selectedItem !== item));
    }
  });

  const selectableConditionalDep = selectable ? selectable.selectedItems : null;

  useEffect(() => {
    if (selectable) {
      setSelectedItems(new Set(selectable.selectedItems));
    }
  }, [selectable, selectableConditionalDep]);

  const onItemSelect = selectable ? eventCallback : undefined;

  const onSortClick = useCallback(
    (column: TableColumn<T>) => {
      if (!sortable || !column.isSortable) {
        return;
      }

      const { hash } = column;
      const sortDirection = sortable.direction === 'ASC' ? 'DESC' : 'ASC';

      if (typeof sortable.onSort === 'function') {
        sortable.onSort(hash, sortDirection, column);
      }
    },
    [sortable],
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;

      if (!destination) {
        return;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      if (typeof onRowDrop === 'function') {
        onRowDrop(source.index, destination.index);
      }

      setHeaderCellWidths([]);
    },
    [onRowDrop],
  );

  const onBeforeDragStart = () => {
    const headerCellIconWidth = headerCellIconRef.current?.offsetWidth ?? 'auto';

    const headerCellsWidths = columns.map((_column, index) => {
      const headerCellElement = window.document.getElementById(`header-cell-${index}`);

      return headerCellElement?.getBoundingClientRect().width ?? 'auto';
    });

    const allHeaderWidths = [headerCellIconWidth, ...headerCellsWidths];
    setHeaderCellWidths(allHeaderWidths);
  };

  const shouldRenderActions = () => {
    return Boolean(actions) || Boolean(pagination) || Boolean(selectable) || Boolean(itemName);
  };

  const getItemKey = (item: T, index: number): string | number => {
    if (item[keyField] !== undefined) {
      return item[keyField];
    }

    return index;
  };

  const renderHeaders = () => (
    <Head hidden={headerless}>
      {instanceReactTable.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id}>
            {typeof onRowDrop === 'function' && (
              <DragIconHeaderCell
                actionsRef={actionsRef}
                width={headerCellWidths.length ? headerCellWidths[0] : 'auto'}
                headerCellIconRef={headerCellIconRef}
              />
            )}
            {isSelectable && <HeaderCheckboxCell stickyHeader={stickyHeader} actionsRef={actionsRef} />}

            {headerGroup.headers.map((header, index) => {
              const column = instanceReactTable.getColumn(header.id).columnDef.meta;
              const { display, hash, isSortable, hideHeader, width } = column;
              const isSorted = isSortable && sortable && hash === sortable.columnHash;
              const sortDirection = sortable && sortable.direction;
              const headerCellWidth = headerCellWidths[index + 1];
              const widthColumn = headerCellWidth ?? width;

              return (
                <HeaderCell
                  display={display}
                  column={{ ...column, width: widthColumn }}
                  hide={hideHeader}
                  id={`header-cell-${index}`}
                  isSorted={isSorted}
                  key={header.id}
                  onSortClick={onSortClick}
                  sortDirection={sortDirection}
                  stickyHeader={stickyHeader}
                  actionsRef={actionsRef}
                >
                  {header.renderHeader()}
                </HeaderCell>
              );
            })}
          </tr>
        );
      })}
    </Head>
  );

  const renderDroppableItems = () => (
    <Droppable droppableId={`${uniqueTableId}-bd-droppable`}>
      {(provided) => (
        <Body withFirstRowBorder={headerless} ref={provided.innerRef} {...provided.droppableProps}>
          {instanceReactTable.getRowModel().rows.map((row, index) => {
            const currentItem = row.original;
            const key = getItemKey(currentItem, index);
            const isSelected = selectedItems.has(currentItem);
            const allColumns = instanceReactTable.getAllColumns();

            return (
              <Draggable key={key} draggableId={String(key)} index={index}>
                {(provided, snapshot) => (
                  <Row
                    isDragging={snapshot.isDragging}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    columns={allColumns}
                    headerCellWidths={headerCellWidths}
                    isSelectable={isSelectable}
                    isSelected={isSelected}
                    item={currentItem}
                    onItemSelect={onItemSelect}
                    showDragIcon={true}
                  />
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </Body>
      )}
    </Droppable>
  );

  const renderItems = () =>
    onRowDrop ? (
      renderDroppableItems()
    ) : (
      <Body withFirstRowBorder={headerless}>
        {instanceReactTable.getRowModel().rows.map((row) => {
          const currentItem = row.original;
          const isSelected = selectedItems.has(currentItem);
          const allColumns = instanceReactTable.getAllColumns();

          return (
            <Row
              columns={allColumns}
              headerCellWidths={headerCellWidths}
              isSelectable={isSelectable}
              isSelected={isSelected}
              item={currentItem}
              key={row.id}
              onItemSelect={onItemSelect}
            />
          );
        })}
      </Body>
    );

  const renderEmptyState = () => {
    if (items.length === 0 && emptyComponent) {
      return emptyComponent;
    }

    return null;
  };

  return (
    <>
      {shouldRenderActions() && (
        <Actions
          customActions={actions}
          pagination={pagination}
          onSelectionChange={selectable && selectable.onSelectionChange}
          selectedItems={selectedItems}
          items={items}
          itemName={itemName}
          tableId={tableIdRef.current}
          stickyHeader={stickyHeader}
          forwardedRef={actionsRef}
        />
      )}
      <StyledTable {...rest} id={tableIdRef.current}>
        {onRowDrop ? (
          <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
            {renderHeaders()}
            {renderItems()}
          </DragDropContext>
        ) : (
          <>
            {renderHeaders()}
            {renderItems()}
          </>
        )}
      </StyledTable>

      {renderEmptyState()}
    </>
  );
};

export const Table = typedMemo(InternalTable);
export const TableFigure: React.FC<MarginProps> = memo((props) => <StyledTableFigure {...props} />);
