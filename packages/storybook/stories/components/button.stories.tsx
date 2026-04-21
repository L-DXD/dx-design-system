import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@dx/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'tertiary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xs', 'icon'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: '가입' } };
export const Secondary: Story = { args: { variant: 'secondary', children: '보조' } };
export const Tertiary: Story = { args: { variant: 'tertiary', children: '3차' } };
export const Destructive: Story = { args: { variant: 'destructive', children: '삭제' } };
export const Outline: Story = { args: { variant: 'outline', children: '아웃라인' } };
export const Ghost: Story = { args: { variant: 'ghost', children: '고스트' } };
export const Link: Story = { args: { variant: 'link', children: '링크' } };
