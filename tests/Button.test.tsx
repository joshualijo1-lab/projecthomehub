import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

it('renders button label', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
