import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../carousel";

export default {
	title: "UI/Carousel",
	component: Carousel,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => (
		<div className="w-full max-w-xs">
			<Carousel>
				<CarouselContent>
					<CarouselItem>
						<div className="flex aspect-square items-center justify-center bg-black text-white rounded-md">
							Slide 1
						</div>
					</CarouselItem>
					<CarouselItem>
						<div className="flex aspect-square items-center justify-center bg-black text-white rounded-md">
							Slide 2
						</div>
					</CarouselItem>
					<CarouselItem>
						<div className="flex aspect-square items-center justify-center bg-black text-white rounded-md">
							Slide 3
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	),
};

export const WithImages = {
	render: () => (
		<div className="w-full max-w-md">
			<Carousel>
				<CarouselContent>
					<CarouselItem>
						<img src="/placeholder.png" alt="Slide 1" className="w-full h-48 object-cover rounded-md" />
					</CarouselItem>
					<CarouselItem>
						<img src="/jancarlo.jpg" alt="Slide 2" className="w-full h-48 object-cover rounded-md" />
					</CarouselItem>
					<CarouselItem>
						<img src="/placeholder.png" alt="Slide 3" className="w-full h-48 object-cover rounded-md" />
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	),
};

export const Vertical = {
	render: () => (
		<div className="h-64 w-full max-w-xs">
			<Carousel orientation="vertical">
				<CarouselContent>
					<CarouselItem>
						<div className="flex aspect-square items-center justify-center bg-black text-white rounded-md">
							Vertical 1
						</div>
					</CarouselItem>
					<CarouselItem>
						<div className="flex aspect-square items-center justify-center bg-black text-white rounded-md">
							Vertical 2
						</div>
					</CarouselItem>
					<CarouselItem>
						<div className="flex aspect-square items-center justify-center bg-black text-white rounded-md">
							Vertical 3
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	),
};
