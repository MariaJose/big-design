import { useEffect, useState } from 'react';

import { useEventCallback } from '../../../../hooks';
import { TableExpandable } from '../../types';

export const useExpandable = <T>(expandable?: TableExpandable<T>) => {
  const [expandedRows, setExpandedRows] = useState<TableExpandable<T>['expandedRows']>({});
  const isExpandable = Boolean(expandable);

  const expandedItemsEventCallback = useEventCallback(
    // TODO: check this
    (parentRowIndex: number | null, parentRowId: string) => {
      if (!expandable || parentRowIndex === null) {
        return;
      }

      const { onExpandedChange } = expandable;

      const isExpandedRow =
        // TODO: check this
        parentRowId !== undefined && parentRowId !== null
          ? expandedRows[parentRowId] !== undefined
          : expandedRows[parentRowIndex] !== undefined;

      if (isExpandedRow) {
        const newExpandedRows = Object.entries(expandedRows).filter(([key]) => {
          if (parentRowId !== undefined) {
            return key !== parentRowId;
          }

          return key !== `${parentRowIndex}`;
        });

        // TODO: update this

        onExpandedChange(Object.fromEntries(newExpandedRows), parentRowId ?? parentRowIndex);
      } else {
        const newExpandedRows = { ...expandedRows };

        // TODO: update this
        newExpandedRows[parentRowId ?? parentRowIndex] = true;

        // TODO: update this
        onExpandedChange(newExpandedRows, parentRowId ?? parentRowIndex);
      }
    },
  );

  useEffect(() => {
    if (expandable?.expandedRows) {
      setExpandedRows({ ...expandable.expandedRows });
    }
  }, [expandable?.expandedRows]);

  return {
    expandedRows,
    expandedRowSelector: expandable?.expandedRowSelector,
    isExpandable,
    onExpandedRow: isExpandable ? expandedItemsEventCallback : undefined,
    setExpandedRows,
  };
};
