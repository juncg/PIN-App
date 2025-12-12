import {
	B1,
	B2,
	B3,
	B4,
	B5,
	H1,
	H2,
	H3,
	H4,
	H5DisplayBold,
	H5SansSemiBold,
	S1,
	S2,
	S2MutedLineThrough,
} from "../typography";

export default {
	title: "UI/Typography",
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export const AllVariants = {
	render: () => (
		<div className="space-y-4">
			<H1>Heading 1 - Funnel Display 5xl Bold</H1>
			<H2>Heading 2 - Funnel Display 4xl Semibold</H2>
			<H3>Heading 3 - Funnel Display 3xl Bold</H3>
			<H4>Heading 4 - Funnel Display 2xl Bold</H4>
			<H5DisplayBold>Heading 5 Display Bold - Funnel Display xl Bold</H5DisplayBold>
			<H5SansSemiBold>Heading 5 Sans Semibold - Funnel Sans xl Semibold</H5SansSemiBold>
			<S1>Subtitle 1 - Funnel Sans lg Bold</S1>
			<S2>Subtitle 2 - Funnel Sans lg Dark Grey</S2>
			<S2MutedLineThrough>
				Subtitle 2 Muted Line Through - Funnel Sans lg Light Grey Strikethrough
			</S2MutedLineThrough>
			<B1>Body 1 - Funnel Sans base Medium</B1>
			<B2>Body 2 - Funnel Sans base Semibold</B2>
			<B3>Body 3 - Funnel Sans base Light Grey</B3>
			<B4>Body 4 - Funnel Sans base Light Grey</B4>
			<B5>Body 5 - Funnel Sans sm Dark Grey</B5>
		</div>
	),
};

export const Headings = {
	render: () => (
		<div className="space-y-2">
			<H1>The quick brown fox</H1>
			<H2>jumps over the lazy dog</H2>
			<H3>The quick brown fox</H3>
			<H4>jumps over the lazy dog</H4>
			<H5DisplayBold>The quick brown fox</H5DisplayBold>
			<H5SansSemiBold>jumps over the lazy dog</H5SansSemiBold>
		</div>
	),
};

export const BodyText = {
	render: () => (
		<div className="space-y-2">
			<B1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</B1>
			<B2>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</B2>
			<B3>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</B3>
			<B4>Nisi ut aliquip ex ea commodo consequat.</B4>
			<B5>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</B5>
		</div>
	),
};
