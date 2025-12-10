import { SmoothScroll } from './smooth-scroll';

export default {
  title: 'UI/SmoothScroll',
  component: SmoothScroll,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <div>
      <SmoothScroll />
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <h1>Scroll down</h1>
      </div>
      <div className="h-screen bg-gray-800 flex items-center justify-center text-white">
        <h1>Section 2</h1>
      </div>
      <div className="h-screen bg-gray-600 flex items-center justify-center text-white">
        <h1>Section 3</h1>
      </div>
    </div>
  ),
};