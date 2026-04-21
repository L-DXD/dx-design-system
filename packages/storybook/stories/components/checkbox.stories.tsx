import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Label } from '@dx/ui';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,

};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { id: 'c1' } };
export const Checked: Story = { args: { id: 'c2', defaultChecked: true } };
export const Disabled: Story = { args: { id: 'c3', disabled: true } };
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">이용약관에 동의합니다</Label>
    </div>
  ),
};
