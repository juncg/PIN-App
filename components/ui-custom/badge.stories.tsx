import { Badge } from './badge';

export default {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Badge>Default</Badge>,
};

export const Secondary = {
  render: () => <Badge variant="secondary">Secondary</Badge>,
};

export const Destructive = {
  render: () => <Badge variant="destructive">Destructive</Badge>,
};

export const Outline = {
  render: () => <Badge variant="outline">Outline</Badge>,
};