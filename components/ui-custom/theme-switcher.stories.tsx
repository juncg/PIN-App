import { ThemeSwitcher } from './theme-switcher';

export default {
  title: 'UI/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <ThemeSwitcher />,
};