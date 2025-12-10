import { Textarea } from './textarea';

export default {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Textarea placeholder="Type your message here." />
  ),
};

export const WithValue = {
  render: () => (
    <Textarea defaultValue="This is some default text." />
  ),
};

export const Disabled = {
  render: () => (
    <Textarea placeholder="Disabled textarea" disabled />
  ),
};

export const WithRows = {
  render: () => (
    <Textarea placeholder="Textarea with 5 rows" rows={5} />
  ),
};