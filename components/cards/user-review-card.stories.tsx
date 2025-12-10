import { UserReviewCard } from './user-review-card';

export default {
  title: 'Cards/UserReviewCard',
  component: UserReviewCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const mockUser = {
  id: '1',
  name: 'John',
  surnames: 'Doe',
  username: 'johndoe',
  profile_picture: '/placeholder.png',
};

const mockReview: any = {
  id: 1,
  title: 'Great Product!',
  content: 'This product exceeded my expectations. The quality is excellent and it works perfectly. Highly recommend!',
  stars: 5,
  created_at: new Date().toISOString(),
  creator_id: '1',
  likes: 12,
  user: mockUser,
  User_Review: [],
};

const mockReviewShort: any = {
  ...mockReview,
  content: 'Good product.',
  stars: 4,
};

export const Default = {
  args: {
    review: mockReview,
    productId: 1,
    currentUserId: '1',
  },
};

export const NotOwner = {
  args: {
    review: mockReview,
    productId: 1,
    currentUserId: '2',
  },
};

export const LowRating = {
  args: {
    review: {
      ...mockReview,
      stars: 2,
      title: 'Not satisfied',
      content: 'The product did not meet my expectations. Quality could be better.',
    },
    productId: 1,
    currentUserId: '1',
  },
};