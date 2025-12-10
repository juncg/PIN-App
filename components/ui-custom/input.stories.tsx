import { Input } from './input';

export default {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Input placeholder="Enter text" />,
};

export const WithValue = {
  render: () => <Input defaultValue="Hello" />,
};

export const Disabled = {
  render: () => <Input disabled placeholder="Disabled" />,
};