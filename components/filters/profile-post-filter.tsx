"use client";

import { Button } from "@/components/ui-custom/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui-custom/carousel";
import { CheckCircle, Clock, Flame, Hand, Infinity, Tag, XCircle } from "lucide-react";
import { useState } from "react";

interface ProfilePostFilterProps {
	onFilterChange: (status: "all" | "offer" | "petition" | "on-fire" | "active" | "completed" | "expired") => void;
}

export function ProfilePostFilter({ onFilterChange }: ProfilePostFilterProps) {
	const [currentStatus, setCurrentStatus] = useState<
		"all" | "offer" | "petition" | "on-fire" | "active" | "completed" | "expired"
	>("all");

	const updateStatusFilter = (
		status: "all" | "offer" | "petition" | "on-fire" | "active" | "completed" | "expired"
	) => {
		setCurrentStatus(status);
		onFilterChange(status);
	};

	return (
		<Carousel
			opts={{
				align: "start",
				loop: false,
			}}
			className="w-full max-w-full"
		>
			<CarouselContent className="-ml-2 md:-ml-4">
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "all" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("all")}
					>
						Todas
						<Infinity className="h-4 w-4" />
					</Button>
				</CarouselItem>
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "offer" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("offer")}
					>
						Ofertas
						<Tag className="h-4 w-4" />
					</Button>
				</CarouselItem>
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "petition" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("petition")}
					>
						Peticiones
						<Hand className="h-4 w-4" />
					</Button>
				</CarouselItem>
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "on-fire" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("on-fire")}
					>
						On Fire
						<Flame className="h-4 w-4" />
					</Button>
				</CarouselItem>
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "active" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("active")}
					>
						Activas
						<Clock className="h-4 w-4" />
					</Button>
				</CarouselItem>
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "completed" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("completed")}
					>
						Completadas
						<CheckCircle className="h-4 w-4" />
					</Button>
				</CarouselItem>
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={currentStatus === "expired" ? "chernobyl" : "outline"}
						onClick={() => updateStatusFilter("expired")}
					>
						Caducadas
						<XCircle className="h-4 w-4" />
					</Button>
				</CarouselItem>
			</CarouselContent>
		</Carousel>
	);
}
