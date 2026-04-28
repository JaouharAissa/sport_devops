import { render, screen } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  expect(true).toBeTruthy();
});

test('App component exists', () => {
  expect(App).toBeDefined();
});