import { SidebarBusinessCard } from './business-card';

export default {
  title: 'Cards/BusinessCard',
  component: SidebarBusinessCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const mockBusiness = {
  id: '1',
  name: 'Tech Solutions Inc.',
  profile_picture: '/placeholder.png',
  followers: 1234,
  verification: 'Verified',
};

const mockBusinessUnverified = {
  id: '2',
  name: 'Startup Co.',
  profile_picture: null,
  followers: 567,
  verification: 'Unverified',
};

export const Default = {
  args: {
    business: mockBusiness,
  },
};

export const Unverified = {
  args: {
    business: mockBusinessUnverified,
  },
};