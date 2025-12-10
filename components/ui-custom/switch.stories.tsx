import { Switch } from './switch';
import { useState } from 'react';

export default {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch checked={checked} onCheckedChange={setChecked} />
    );
  },
};

export const WithLabels = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        innerTextUnchecked="OFF"
        innerTextChecked="ON"
      />
    );
  },
};

export const WithLongLabels = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        innerTextUnchecked="Disabled"
        innerTextChecked="Enabled"
      />
    );
  },
};

export const Uncontrolled = {
  render: () => (
    <Switch defaultChecked={true} />
  ),
};

export const Disabled = {
  render: () => (
    <Switch disabled checked={false} />
  ),
};