import { Calendar } from './calendar';
import { useState } from 'react';

export default {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <Calendar />,
};

export const SingleSelection = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

export const RangeSelection = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>();
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
    );
  },
};

export const MultipleMonths = {
  render: () => (
    <Calendar
      numberOfMonths={2}
    />
  ),
};

export const WithDisabledDates = {
  render: () => {
    const today = new Date();
    const disabledDays = [
      { before: today },
      { after: new Date(today.getFullYear(), today.getMonth() + 1, 0) },
    ];
    return (
      <Calendar
        disabled={disabledDays}
      />
    );
  },
};