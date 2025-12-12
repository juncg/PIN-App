import { useState } from "react";
import { DateInput } from "../date-input";

export default {
	title: "UI/DateInput",
	component: DateInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();
		return <DateInput buttonText="Select date" onDateChange={setDate} />;
	},
};

export const WithDefaultDate = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date());
		return <DateInput buttonText="Select date" defaultDate={new Date()} onDateChange={setDate} />;
	},
};

export const WithDisabledDates = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();
		const today = new Date();
		const disabledDays = [{ before: today }];
		return <DateInput buttonText="Select future date" disabled={disabledDays} onDateChange={setDate} />;
	},
};

export const ButtonDisabled = {
	render: () => <DateInput buttonText="Disabled input" buttonDisabled={true} />,
};

export const WithMonthRange = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>();
		const today = new Date();
		return (
			<DateInput
				buttonText="Select date"
				startMonth={new Date(today.getFullYear(), today.getMonth() - 1)}
				endMonth={new Date(today.getFullYear(), today.getMonth() + 1)}
				onDateChange={setDate}
			/>
		);
	},
};
