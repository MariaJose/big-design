import { useEffect, useState } from 'react';

import { useEventCallback } from '../../../../hooks';
import { TableExpandable } from '../../types';

export const useExpandable = <T>(expandable?: TableExpandable<T>) => {
  const [expandedRows, setExpandedRows] = useState<TableExpandable<T>['expandedRows']>({});
  const isExpandable = Boolean(expandable);

  const expandedItemsEventCallback = useEventCallback((parentRowIndex: number | null) => {
    if (!expandable || parentRowIndex === null) {
      return;
    }

    const { onExpandedChange } = expandable;

    const isExpandedRow = expandedRows[parentRowIndex] !== undefined;
    const newExpandedRows = { ...expandedRows };

    if (isExpandedRow) {
      delete newExpandedRows[parentRowIndex];

      onExpandedChange(newExpandedRows);
    } else {
      newExpandedRows[parentRowIndex] = true;

      onExpandedChange(newExpandedRows);
    }
  });

  const expandableConditialDep = expandable ? expandable.expandedRows : null;

  useEffect(() => {
    if (expandable) {
      setExpandedRows({ ...expandable.expandedRows });
    }
  }, [expandable, expandableConditialDep]);

  return {
    expandedRows,
    expandedRowSelector: expandable?.expandedRowSelector,
    isExpandable,
    onExpandedRow: isExpandable ? expandedItemsEventCallback : undefined,
    setExpandedRows,
  };
};
