import { ProductReviewsSummaryCard } from './product-reviews-summary-card';

export default {
  title: 'Cards/ProductReviewsSummaryCard',
  component: ProductReviewsSummaryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    rating: 4.5,
    numOfReviews: 128,
  },
};

export const NoRating = {
  args: {
    rating: null,
    numOfReviews: 0,
  },
};

export const PerfectRating = {
  args: {
    rating: 5.0,
    numOfReviews: 50,
  },
};