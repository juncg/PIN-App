import { LocaleSwitcher } from './locale-switcher';

export default {
  title: 'UI/LocaleSwitcher',
  component: LocaleSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <LocaleSwitcher />,
};