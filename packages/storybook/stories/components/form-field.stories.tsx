import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FormField,
  Label,
  Input,
  HelperText,
  ErrorMessage,
  Checkbox,
} from '@dx/ui';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,

};
export default meta;
type Story = StoryObj<typeof FormField>;

export const Basic: Story = {
  render: () => (
    <FormField>
      <Label htmlFor="email">이메일</Label>
      <Input id="email" type="email" placeholder="name@company.com" />
      <HelperText>회사 이메일을 입력하세요</HelperText>
    </FormField>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <FormField orientation="horizontal">
      <Checkbox id="terms" />
      <Label htmlFor="terms">이용약관에 동의합니다</Label>
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField>
      <Label htmlFor="e2">이메일</Label>
      <Input id="e2" type="email" defaultValue="invalid" />
      <ErrorMessage>유효하지 않은 이메일입니다</ErrorMessage>
    </FormField>
  ),
};
