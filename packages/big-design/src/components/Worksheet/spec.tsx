import { theme } from '@bigcommerce/big-design-theme';
import { fireEvent, render, screen, waitForElement } from '@testing-library/react';
import React from 'react';

import { StatefulTree } from '../StatefulTree';

import { WorksheetColumn } from './types';
import { Worksheet } from './Worksheet';

interface Product {
  id: number;
  productName: string;
  visibleOnStorefront: boolean;
  otherField: string;
  otherField2: number;
  numberField: number;
}

const TreeComponent = (value: string | number | boolean, onChange: (value: string | number | boolean) => void) => {
  const nodes = [
    {
      id: '0',
      value: 0,
      label: 'Category 0',
      children: [
        {
          id: '5',
          value: 5,
          label: 'Category 5',
          children: [{ id: '9', value: 9, label: 'Category 9' }],
        },
      ],
    },
    {
      id: '1',
      value: 1,
      label: 'Category 1',
      children: [{ id: '6', value: 6, label: 'Category 6' }],
    },
    { id: '2', value: 2, label: 'Category 2' },
    {
      id: '3',
      value: 3,
      label: 'Category 3',
      children: [{ id: '7', value: 7, label: 'Category 7' }],
    },
    { id: '4', value: 4, label: 'Category 4', children: [{ id: '8', value: 8, label: 'Category 8' }] },
  ];

  return (
    <StatefulTree
      defaultExpanded={['0', '5', '1']}
      defaultSelected={[String(value)]}
      disabledNodes={['1']}
      nodes={nodes}
      onSelectionChange={(selectedNodes) => onChange(selectedNodes[0])}
      selectable="radio"
    />
  );
};

const columns: WorksheetColumn<Product>[] = [
  { hash: 'productName', header: 'Product name', validation: (value: string) => !!value },
  { hash: 'visibleOnStorefront', header: 'Visible on storefront', type: 'checkbox' },
  { hash: 'otherField', header: 'Other field' },
  {
    hash: 'otherField2',
    header: 'Other field',
    type: 'modal',
    config: { header: 'Choose categories', render: TreeComponent },
  },
  {
    hash: 'numberField',
    header: 'Number field',
    type: 'number',
    validation: (value: number) => value >= 50,
    formatting: (value: number) => `$${value}.00`,
  },
];

const selectableColumns: WorksheetColumn<Partial<Product>>[] = [
  { hash: 'productName', header: 'Product name', validation: (value: string) => !!value, disabled: true },
  {
    hash: 'otherField',
    header: 'Other field',
    type: 'select',
    config: {
      options: [
        { value: 'value1', content: 'Value 1' },
        { value: 'value2', content: 'Value 2' },
        { value: 'value3', content: 'Value 3' },
      ],
    },
    validation: (value: string) => !!value,
  },
];

const disabledColumns: WorksheetColumn<Product>[] = [
  { hash: 'productName', header: 'Product name', validation: (value: string) => !!value, disabled: true },
  { hash: 'visibleOnStorefront', header: 'Visible on storefront', type: 'checkbox', disabled: true },
  { hash: 'otherField', header: 'Other field', disabled: true },
  {
    hash: 'otherField2',
    header: 'Other field',
    type: 'modal',
    config: { header: 'Choose categories', render: TreeComponent },
    disabled: true,
  },
  {
    hash: 'numberField',
    header: 'Number field',
    type: 'number',
    validation: (value: number) => value >= 50,
    formatting: (value: number) => `$${value}.00`,
    disabled: true,
  },
];

const items: Product[] = [
  {
    id: 1,
    productName: 'Shoes Name Three',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 1,
    numberField: 50,
  },
  {
    id: 2,
    productName: 'Shoes Name Two',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 2,
    numberField: 50,
  },
  {
    id: 3,
    productName: 'Shoes Name One',
    visibleOnStorefront: false,
    otherField: 'Text',
    otherField2: 3,
    numberField: 50,
  },
  {
    id: 4,
    productName: 'Variant 1',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 4,
    numberField: 50,
  },
  {
    id: 5,
    productName: '',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 5,
    numberField: 50,
  },
  {
    id: 6,
    productName: 'Variant 2',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 6,
    numberField: 50,
  },
  {
    id: 7,
    productName: 'Variant 3',
    visibleOnStorefront: false,
    otherField: 'Text',
    otherField2: 7,
    numberField: 49,
  },
  {
    id: 8,
    productName: 'Dress Name One',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 8,
    numberField: 50,
  },
  {
    id: 9,
    productName: 'Fans Name One',
    visibleOnStorefront: true,
    otherField: 'Text',
    otherField2: 9,
    numberField: 50,
  },
];

const selectableItems: Partial<Product>[] = [
  {
    id: 1,
    productName: 'Shoes Name One',
    otherField: 'value1',
  },
  {
    id: 2,
    productName: 'Shoes Name Two',
    otherField: 'value2',
  },
];

let handleChange = jest.fn();
let handleErrors = jest.fn();

beforeEach(() => {
  handleChange = jest.fn();
  handleErrors = jest.fn();
});

test('renders worksheet', () => {
  const { container } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

  expect(container.firstChild).toMatchSnapshot();
});

describe('selection', () => {
  test('selects cell on click', () => {
    const { getByText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);
    const cell = getByText('Shoes Name One').parentElement as HTMLTableDataCellElement;
    const row = cell.parentElement as HTMLTableRowElement;

    fireEvent.click(cell);

    expect(cell).toHaveStyle(`border-color: ${theme.colors.primary}`);
    expect(row.firstChild).toHaveStyle(`background-color: ${theme.colors.primary}`);
  });
});

describe('edition', () => {
  test('onChange is not called when value does not change', () => {
    const { getByDisplayValue, getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    let cell;

    cell = getByText('Shoes Name One');

    fireEvent.doubleClick(getByText('Shoes Name One'));

    const input = getByDisplayValue('Shoes Name One') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Shoes Name One' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    cell = getByText('Shoes Name One');
    expect(cell).toBeDefined();
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('onChange is called when value changes', () => {
    const { getByDisplayValue, getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    let cell;

    cell = getByText('Shoes Name One');

    fireEvent.doubleClick(cell);

    const input = getByDisplayValue('Shoes Name One') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Shoes Name One Edit' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    cell = getByText('Shoes Name One Edit');
    expect(cell).toBeDefined();
  });

  test('regains focus when it stops editing', () => {
    const { getByText, getByDisplayValue, getByRole } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    const table = getByRole('table');

    fireEvent.doubleClick(getByText('Shoes Name Three'));

    fireEvent.keyDown(getByDisplayValue('Shoes Name Three'), { key: 'Escape' });

    expect(table).toHaveFocus();
  });

  test('edition does not mutate items array', () => {
    // At this point, if our previous tests mutated the items array, this value would be different
    expect(items[2]).toStrictEqual({
      id: 3,
      productName: 'Shoes Name One',
      visibleOnStorefront: false,
      otherField: 'Text',
      otherField2: 3,
      numberField: 50,
    });
  });
});

describe('validation', () => {
  test('invalid cells have the red border', () => {
    const { getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} onErrors={handleErrors} />,
    );

    const cell = getByText('$49.00').parentElement as HTMLTableDataCellElement;
    const row = cell.parentElement as HTMLTableRowElement;

    expect(cell).toHaveStyle(`border-color: ${theme.colors.danger}`);
    expect(row.firstChild).toHaveStyle(`background-color: ${theme.colors.danger}`);
  });

  test('onErrors gets called with invalid cells', () => {
    let cell;
    let input;

    const { getByDisplayValue, getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} onErrors={handleErrors} />,
    );

    expect(handleErrors).toBeCalledTimes(1);
    expect(handleErrors).toBeCalledWith([
      {
        item: {
          id: 5,
          productName: '',
          visibleOnStorefront: true,
          otherField: 'Text',
          otherField2: 5,
          numberField: 50,
        },
        errors: ['productName'],
      },
      {
        item: {
          id: 7,
          productName: 'Variant 3',
          visibleOnStorefront: false,
          otherField: 'Text',
          otherField2: 7,
          numberField: 49,
        },
        errors: ['numberField'],
      },
    ]);

    cell = getByText('$49.00') as HTMLElement;

    fireEvent.doubleClick(cell);

    input = getByDisplayValue('49') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 40 } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleErrors).toBeCalledTimes(2);
    expect(handleErrors).toBeCalledWith([
      {
        item: {
          id: 5,
          productName: '',
          visibleOnStorefront: true,
          otherField: 'Text',
          otherField2: 5,
          numberField: 50,
        },
        errors: ['productName'],
      },
      {
        item: {
          id: 7,
          productName: 'Variant 3',
          visibleOnStorefront: false,
          otherField: 'Text',
          otherField2: 7,
          numberField: 40,
        },
        errors: ['numberField'],
      },
    ]);

    cell = getByText('$40.00');

    fireEvent.doubleClick(cell);

    input = getByDisplayValue('40') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 60 } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleErrors).toBeCalledTimes(3);
    expect(handleErrors).toBeCalledWith([
      {
        item: {
          id: 5,
          productName: '',
          visibleOnStorefront: true,
          otherField: 'Text',
          otherField2: 5,
          numberField: 50,
        },
        errors: ['productName'],
      },
    ]);
  });
});

describe('formatting', () => {
  test('formats values', () => {
    const { getAllByText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    expect(getAllByText('$50.00').length).toBe(8);
  });
});

describe('keyboard navigation', () => {
  test('navigates with arrow keys', () => {
    const { getAllByText, getByText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    let cell = getByText('Shoes Name Three');
    fireEvent.click(cell);

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowLeft' });

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowDown' });

    cell = getByText('Shoes Name Two');

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowUp' });

    cell = getByText('Shoes Name Three');

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowRight' });
    fireEvent.keyDown(cell, { key: 'ArrowRight' });

    const cells = getAllByText('Text');

    expect(cells[0].parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);
  });

  test('navigates with tab', () => {
    const { getAllByText, getByText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    const cell = getByText('Shoes Name Three');

    fireEvent.click(cell);

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'Tab' });
    fireEvent.keyDown(cell, { key: 'Tab' });

    const cells = getAllByText('Text');

    expect(cells[0].parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'Tab', shiftKey: true });
    fireEvent.keyDown(cell, { key: 'Tab', shiftKey: true });

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);
  });

  test('enter starts editing the cell', () => {
    const { getByDisplayValue, getByText, getByRole } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    const worksheet = getByRole('table');
    const cell = getByText('Shoes Name Three');

    fireEvent.click(cell);
    fireEvent.keyDown(worksheet, { key: 'Enter' });

    expect(getByDisplayValue('Shoes Name Three')).toBeDefined();
  });

  test('space starts editing the cell', () => {
    const { getByDisplayValue, getByText, getByRole } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    const worksheet = getByRole('table');
    const cell = getByText('Shoes Name Three');

    fireEvent.click(cell);
    fireEvent.keyDown(worksheet, { key: ' ' });

    expect(getByDisplayValue('Shoes Name Three')).toBeDefined();
  });

  test('enter/space on checkbox navigates down and toggles value', () => {
    const { getAllByLabelText, getByRole } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    const worksheet = getByRole('table');
    const cells = getAllByLabelText('Checked');

    fireEvent.click(cells[0]);
    fireEvent.keyDown(worksheet, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenLastCalledWith([
      {
        id: 1,
        productName: 'Shoes Name Three',
        visibleOnStorefront: true,
        otherField: 'Text',
        otherField2: 1,
        numberField: 50,
      },
    ]);
    expect(cells[1].parentElement?.parentElement?.parentElement).toHaveStyle(`border-color: ${theme.colors.primary};`);

    fireEvent.keyDown(worksheet, { key: ' ' });

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith([
      {
        id: 1,
        productName: 'Shoes Name Three',
        visibleOnStorefront: true,
        otherField: 'Text',
        otherField2: 1,
        numberField: 50,
      },
      {
        id: 2,
        productName: 'Shoes Name Two',
        visibleOnStorefront: false,
        otherField: 'Text',
        otherField2: 2,
        numberField: 50,
      },
    ]);
  });
});

describe('TextEditor', () => {
  test('renders TextEditor', () => {
    const { getByDisplayValue, getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    const cell = getByText('Shoes Name One');

    fireEvent.doubleClick(cell);

    const input = getByDisplayValue('Shoes Name One') as HTMLInputElement;

    expect(input).toBeDefined();
  });

  test('TextEditor is editable', () => {
    const { getByDisplayValue, getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    let input;
    let cell;

    cell = getByText('Shoes Name One');

    expect(cell.parentNode).toHaveStyle(`background-color: ${theme.colors.inherit};`);

    fireEvent.doubleClick(cell);

    input = getByDisplayValue('Shoes Name One') as HTMLInputElement;

    expect(input).toHaveStyle(`background-color: ${theme.colors.inherit}`);

    fireEvent.change(input, { target: { value: 'Shoes Name One Edit' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith([
      {
        id: 3,
        productName: 'Shoes Name One Edit',
        visibleOnStorefront: false,
        otherField: 'Text',
        otherField2: 3,
        numberField: 50,
      },
    ]);

    cell = getByText('Shoes Name One Edit');

    expect(cell.parentNode).toHaveStyle(`background-color: ${theme.colors.warning10};`);

    fireEvent.doubleClick(cell);

    input = getByDisplayValue('Shoes Name One Edit') as HTMLInputElement;

    expect(input).toHaveStyle(`background-color: ${theme.colors.warning10};`);
  });

  test('column type number returns number', () => {
    const { getByDisplayValue, getByText } = render(
      <Worksheet columns={columns} items={items} onChange={handleChange} />,
    );

    const cell = getByText('$49.00') as HTMLElement;

    fireEvent.doubleClick(cell);

    const input = getByDisplayValue('49') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 80 } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith([
      {
        id: 7,
        productName: 'Variant 3',
        visibleOnStorefront: false,
        otherField: 'Text',
        otherField2: 7,
        numberField: 80,
      },
    ]);
  });

  test('renders in disabled state', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    const cell = screen.getByText('Shoes Name One');

    expect(cell).toHaveStyle('color: #8C93AD');
  });
});

describe('SelectEditor', () => {
  test('renders SelectEditor', async () => {
    const { getAllByRole } = render(
      <Worksheet columns={selectableColumns} items={selectableItems} onChange={handleChange} />,
    );

    const cells = getAllByRole('combobox');

    expect(cells.length).toBe(2);

    await waitForElement(() => screen.getAllByRole('combobox'));
  });

  test('SelectEditor is editable', async () => {
    const { getAllByRole, getAllByDisplayValue } = render(
      <Worksheet columns={selectableColumns} items={selectableItems} onChange={handleChange} />,
    );

    const cells = getAllByDisplayValue('Value 1');

    fireEvent.click(cells[0]);

    const options = getAllByRole('option');

    fireEvent.click(options[2]);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith([
      {
        id: 1,
        productName: 'Shoes Name One',
        otherField: 'value3',
      },
    ]);

    await waitForElement(() => screen.getAllByRole('combobox'));
  });

  test('renders in disabled state', async () => {
    render(
      <Worksheet
        columns={[
          { hash: 'productName', header: 'Product name', validation: (value: string) => !!value, disabled: true },
          {
            hash: 'otherField',
            header: 'Other field',
            type: 'select',
            config: {
              options: [
                { value: 'value1', content: 'Value 1' },
                { value: 'value2', content: 'Value 2' },
                { value: 'value3', content: 'Value 3' },
              ],
            },
            validation: (value: string) => !!value,
            disabled: true,
          },
        ]}
        items={selectableItems}
        onChange={handleChange}
      />,
    );

    const cell = screen.getAllByDisplayValue('Value 1');

    expect(cell[0]).toHaveAttribute('disabled');

    await waitForElement(() => screen.getAllByRole('combobox'));
  });
});

describe('CheckboxEditor', () => {
  test('renders CheckboxEditor', () => {
    const { getAllByLabelText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    let cells = getAllByLabelText('Checked');

    expect(cells.length).toBe(7);

    cells = getAllByLabelText('Unchecked');

    expect(cells.length).toBe(2);
  });

  test('CheckboxEditor is editable', () => {
    const { getAllByLabelText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    const cells = getAllByLabelText('Checked');
    const cell = cells[0];

    fireEvent.click(cell);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith([
      {
        id: 1,
        productName: 'Shoes Name Three',
        visibleOnStorefront: false,
        otherField: 'Text',
        otherField2: 1,
        numberField: 50,
      },
    ]);
  });

  test('renders in disabled state', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    const cell = screen.getAllByLabelText('Checked');

    expect(cell[0]).toHaveAttribute('disabled');
  });
});

describe('ModalEditor', () => {
  test('renders ModalEditor', () => {
    const { getAllByText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    const buttons = getAllByText('Edit');

    expect(buttons.length).toBe(9);
  });

  test('ModalEditor is editable', () => {
    const { getAllByText, getByText } = render(<Worksheet columns={columns} items={items} onChange={handleChange} />);

    const buttons = getAllByText('Edit');

    expect(buttons.length).toBe(9);

    fireEvent.click(buttons[3]);

    // Find checkbox to click
    const parent = getByText('Category 0').parentNode?.parentNode;
    const checkbox = parent?.querySelector('label');
    fireEvent.click(checkbox as HTMLLabelElement);

    const save = getByText('Save');
    fireEvent.click(save);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenLastCalledWith([
      {
        id: 4,
        productName: 'Variant 1',
        visibleOnStorefront: true,
        otherField: 'Text',
        otherField2: 0,
        numberField: 50,
      },
    ]);

    const cell = buttons[3].parentNode?.parentNode?.parentNode;

    expect(cell).toHaveStyle(`background-color: ${theme.colors.warning10};`);
  });

  test('renders in disabled state', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    const buttons = screen.getAllByRole('button', { name: /edit/i });

    expect(buttons[0]).toHaveAttribute('disabled');
  });
});

describe('disable', () => {
  test('navigation works on disabled cells', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    let cell = screen.getByText('Shoes Name Three');

    fireEvent.click(cell);

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowLeft' });

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowDown' });

    cell = screen.getByText('Shoes Name Two');

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowUp' });

    cell = screen.getByText('Shoes Name Three');

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowRight' });
    fireEvent.keyDown(cell, { key: 'ArrowRight' });

    const cells = screen.getAllByText('Text');

    expect(cells[0].parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);
  });

  test('enter does not start editing the cell', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    const worksheet = screen.getByRole('table');

    const cell = screen.getByText('Shoes Name Three');

    fireEvent.click(cell);
    fireEvent.keyDown(worksheet, { key: 'Enter' });

    expect(screen.queryByDisplayValue('Shoes Name Three')).toBeNull();
  });

  test('space does not start editing the cell', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    const worksheet = screen.getByRole('table');

    const cell = screen.getByText('Shoes Name Three');

    fireEvent.click(cell);
    fireEvent.keyDown(worksheet, { key: ' ' });

    expect(screen.queryByDisplayValue('Shoes Name Three')).toBeNull();
  });

  test('mouse will not trigger input field', () => {
    render(<Worksheet columns={disabledColumns} items={items} onChange={handleChange} />);

    fireEvent.doubleClick(screen.getByText('Shoes Name One'));

    expect(screen.queryByDisplayValue('Shoes Name One')).toBeNull();
  });
});

describe('expandable', () => {
  test('renders expandable buttons', () => {
    render(
      <Worksheet
        columns={disabledColumns}
        expandableRows={{ 2: [3], 5: [6, 7] }}
        items={items}
        onChange={handleChange}
      />,
    );

    expect(screen.queryAllByTitle('toggle row expanded').length).toBe(2);
  });

  test('toggles rows', () => {
    render(
      <Worksheet
        columns={disabledColumns}
        expandableRows={{ 2: [3], 5: [6, 7] }}
        items={items}
        onChange={handleChange}
      />,
    );

    // expect(screen.queryAllByRole('row').length).toBeVisible();
    expect(screen.queryByRole('row', { name: /shoes name one/i })).not.toBeInTheDocument();

    const buttons = screen.queryAllByTitle('toggle row expanded');

    fireEvent.click(buttons[0]);

    expect(screen.queryByRole('row', { name: /shoes name one/i })).toBeInTheDocument();

    // expect(screen.queryAllByRole('row').length).toBe(8);

    expect(screen.queryByRole('row', { name: /variant 2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /variant 3/i })).not.toBeInTheDocument();

    fireEvent.click(buttons[1]);

    expect(screen.queryByRole('row', { name: /variant 2/i })).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /variant 2/i })).toBeInTheDocument();
    // expect(screen.queryAllByRole('row').length).toBe(10);

    fireEvent.click(buttons[1]);

    expect(screen.queryByRole('row', { name: /variant 2/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /variant 3/i })).not.toBeInTheDocument();

    // expect(screen.queryAllByRole('row').length).toBe(8);

    fireEvent.keyDown(buttons[1], { key: 'Enter' });

    // expect(screen.queryAllByRole('row').length).toBe(10);
    expect(screen.queryByRole('row', { name: /variant 2/i })).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /variant 2/i })).toBeInTheDocument();
  });

  test('keyboard navigates correctly', () => {
    render(
      <Worksheet
        columns={disabledColumns}
        expandableRows={{ 2: [3], 5: [6, 7] }}
        items={items}
        onChange={handleChange}
      />,
    );

    const buttons = screen.queryAllByTitle('toggle row expanded');

    let cell = screen.getByText('Shoes Name Two');

    fireEvent.click(cell);

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowDown' });

    const variant = screen.getByText('Variant 1');

    expect(variant.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.keyDown(cell, { key: 'ArrowUp' });

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);

    fireEvent.click(buttons[0]);
    fireEvent.click(variant);

    fireEvent.keyDown(cell, { key: 'ArrowUp' });

    cell = screen.getByText('Shoes Name One');

    expect(cell.parentElement).toHaveStyle(`border-color: ${theme.colors.primary}`);
  });
});
