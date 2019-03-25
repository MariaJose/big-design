import 'jest-styled-components';
import React from 'react';
import { render } from 'react-testing-library';
import styled from 'styled-components';

import { defaultTheme } from '../../theme';

import { withMargins, MarginProps } from './margins';

const TestComponent = styled.div<MarginProps>`
  ${withMargins()};
`;

TestComponent.defaultProps = { theme: defaultTheme };

test('margin', () => {
  const { container } = render(<TestComponent margin="medium" />);

  expect(container.firstChild).toHaveStyle('margin: 1rem');
});

test('marginTop', () => {
  const { container } = render(<TestComponent marginTop="medium" />);

  expect(container.firstChild).toHaveStyle('margin-top: 1rem');

  expect(container.firstChild).not.toHaveStyle('margin: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-right: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-left: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-bottom: 1rem');
});

test('marginRight', () => {
  const { container } = render(<TestComponent marginRight="medium" />);

  expect(container.firstChild).toHaveStyle('margin-right: 1rem');

  expect(container.firstChild).not.toHaveStyle('margin: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-top: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-left: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-bottom: 1rem');
});

test('marginBottom', () => {
  const { container } = render(<TestComponent marginBottom="medium" />);

  expect(container.firstChild).toHaveStyle('margin-bottom: 1rem');

  expect(container.firstChild).not.toHaveStyle('margin: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-top: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-right: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-left: 1rem');
});

test('marginLeft', () => {
  const { container } = render(<TestComponent marginLeft="medium" />);

  expect(container.firstChild).toHaveStyle('margin-left: 1rem');

  expect(container.firstChild).not.toHaveStyle('margin: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-top: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-right: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-bottom: 1rem');
});

test('marginVertical', () => {
  const { container } = render(<TestComponent marginVertical="medium" />);

  expect(container.firstChild).toHaveStyle('margin-top: 1rem');
  expect(container.firstChild).toHaveStyle('margin-bottom: 1rem');

  expect(container.firstChild).not.toHaveStyle('margin: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-right: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-left: 1rem');
});

test('marginHorizontal', () => {
  const { container } = render(<TestComponent marginHorizontal="medium" />);

  expect(container.firstChild).toHaveStyle('margin-left: 1rem');
  expect(container.firstChild).toHaveStyle('margin-right: 1rem');

  expect(container.firstChild).not.toHaveStyle('margin: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-top: 1rem');
  expect(container.firstChild).not.toHaveStyle('margin-bottom: 1rem');
});

test('simple margins combination', () => {
  const { container } = render(<TestComponent marginTop="medium" marginBottom="none" marginRight="small" />);

  expect(container.firstChild).toHaveStyle('margin-top: 1rem');
  expect(container.firstChild).toHaveStyle('margin-bottom: 0px');
  expect(container.firstChild).toHaveStyle('margin-right: 0.75rem');
});

test('responsive margin', () => {
  const { container } = render(<TestComponent margin={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive marginTop', () => {
  const { container } = render(<TestComponent marginTop={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive marginRight', () => {
  const { container } = render(<TestComponent marginRight={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive marginBottom', () => {
  const { container } = render(<TestComponent marginBottom={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive marginLeft', () => {
  const { container } = render(<TestComponent marginLeft={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive marginVertical', () => {
  const { container } = render(
    <TestComponent marginVertical={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive marginHorizontal', () => {
  const { container } = render(
    <TestComponent marginHorizontal={{ mobile: 'none', tablet: 'small', desktop: 'medium' }} />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('responsive and non responsive combination', () => {
  const { container } = render(
    <TestComponent
      marginTop="none"
      marginLeft={{ mobile: 'none', tablet: 'small', desktop: 'medium' }}
      marginBottom="medium"
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});
