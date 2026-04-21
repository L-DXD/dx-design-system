import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@dx/ui';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,

  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: '입력하세요' } };
export const Email: Story = { args: { type: 'email', placeholder: 'name@company.com' } };
export const Password: Story = { args: { type: 'password', placeholder: '비밀번호' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '비활성' } };
