import { SidebarForumCard } from './sidebar-forum-card';

export default {
  title: 'Cards/SidebarForumCard',
  component: SidebarForumCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const mockForum: any = {
  id: '1',
  name: 'Tech Discussions',
  profile_picture: '/placeholder.png',
  Business: {
    name: 'Tech Corp',
  },
};

const mockForumNoImage: any = {
  ...mockForum,
  profile_picture: null,
};

export const Default = {
  args: {
    forum: mockForum,
  },
};

export const NoImage = {
  args: {
    forum: mockForumNoImage,
  },
};