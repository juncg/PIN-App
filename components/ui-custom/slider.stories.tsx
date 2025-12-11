import { Slider } from './slider';
import { useState } from 'react';

export default {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => {
    const [value, setValue] = useState([50]);
    return (
      <div className="w-64 space-y-4">
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <p className="text-sm text-center">Value: {value[0]}</p>
      </div>
    );
  },
};

export const Range = {
  render: () => {
    const [value, setValue] = useState([25, 75]);
    return (
      <div className="w-64 space-y-4">
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <p className="text-sm text-center">Range: {value[0]} - {value[1]}</p>
      </div>
    );
  },
};

export const Vertical = {
  render: () => {
    const [value, setValue] = useState([50]);
    return (
      <div className="h-64 flex items-center justify-center">
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          orientation="vertical"
          className="h-48"
        />
        <p className="ml-4 text-sm">Value: {value[0]}</p>
      </div>
    );
  },
};

export const WithSteps = {
  render: () => {
    const [value, setValue] = useState([0]);
    return (
      <div className="w-64 space-y-4">
        <Slider value={value} onValueChange={setValue} max={10} step={1} />
        <p className="text-sm text-center">Step: {value[0]}</p>
      </div>
    );
  },
};