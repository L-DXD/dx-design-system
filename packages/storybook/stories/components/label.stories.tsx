import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Input } from '@dx/ui';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,

};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { htmlFor: 'demo', children: '이메일' },
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="demo-email">이메일</Label>
      <Input id="demo-email" type="email" placeholder="name@company.com" />
    </div>
  ),
};
