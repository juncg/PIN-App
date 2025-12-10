import { ProductCardHorizontal } from './product-card-horizontal';

export default {
  title: 'Cards/ProductCardHorizontal',
  component: ProductCardHorizontal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const mockProduct: any = {
  id: '1',
  name: 'Wireless Headphones',
  images: ['/placeholder.png'],
  msrp: 99.99,
  businesses: [
    {
      business: {
        name: 'Audio Tech',
      },
    },
  ],
};

export const Default = {
  args: {
    ...mockProduct,
  },
};