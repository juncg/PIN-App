import { ProductCard } from './product-card';

export default {
  title: 'Cards/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const mockProduct: any = {
  id: '1',
  name: 'Wireless Headphones',
  description: 'High-quality wireless headphones with noise cancellation and long battery life.',
  images: ['/placeholder.png'],
  msrp: 99.99,
  rating: 4.5,
  businesses: [
    {
      business: {
        name: 'Audio Tech',
      },
    },
  ],
  Review_Product: [{}, {}, {}, {}, {}], // 5 reviews
};

export const Default = {
  args: {
    props: {
      product: mockProduct,
    },
  },
};

export const NoDescription = {
  args: {
    props: {
      product: {
        ...mockProduct,
        description: undefined,
      },
    },
  },
};