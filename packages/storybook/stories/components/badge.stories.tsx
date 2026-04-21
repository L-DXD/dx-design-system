import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@dx/ui';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'tertiary', 'destructive', 'outline'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'New' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Beta' } };
export const Tertiary: Story = { args: { variant: 'tertiary', children: '3차' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Error' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Draft' } };
