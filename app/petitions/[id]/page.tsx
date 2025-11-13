import { ProductImages } from "@/components/products/product-images";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GetRelativeTime } from "@/lib/services/utilities";
import { ISearchParams } from "@/types";
import { Users } from "lucide-react";
import { PetitionDetailsService } from "./page-services";

interface PetitionPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

const images = {
	images: ["/placeholder.png", "/placeholder.png", "/placeholder.png", "/placeholder.png"],
};

export default async function PetitionPage({ params }: PetitionPageProps) {
	const { id } = await params;

	const { petition } = await PetitionDetailsService(id);

	if (!petition) {
		return <div>Loading...</div>;
	}

	const petitionCompletitionPercentage = parseFloat(
		((petition[0].current_progress * 100) / (petition[0]?.target_progress ?? 1)).toFixed(2)
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid lg:grid-cols-2 gap-8 mb-12">
				<ProductImages images={images.images} />

				<div className="space-y-6">
					<div className="inline-block bg-primary text-black text-xs font-black px-3 py-1 rounded-full mb-3">
						TECNOLOGÍA
					</div>
					<h1 className="text-4xl font-black mb-4">{petition[0].title}</h1>

					<div className="flex items-center gap-3 mb-6">
						<Avatar className="w-10 h-10 border-2 border-black">
							<AvatarFallback className="bg-primary text-black font-bold">JD</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-black">John Doe</div>
							<div className="text-xs text-muted-foreground">
								{GetRelativeTime(petition[0].created_at)}
							</div>
						</div>
					</div>

					<Separator />

					<div className="mb-6">
						<div className="flex items-center justify-between mb-3">
							<span className="text-lg font-black">Progreso del objetivo</span>
							<span className="text-lg font-black">
								{petition[0].current_progress} de {petition[0].target_progress}{" "}
								<Users className="w-5 h-5 inline" />
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<Progress value={petitionCompletitionPercentage} />
						</div>
						<div className="text-sm font-bold text-muted-foreground">
							¡Solo faltan 281 usuarios más para desbloquear esta oferta!
						</div>
					</div>

					<Separator />

					<div className="bg-muted rounded-2xl p-6 mb-6 border-3 border-black">
						<h3 className="font-black text-lg mb-3">Descripción</h3>
						<p className="text-sm leading-relaxed mb-4">{petition[0].text}</p>
					</div>
				</div>
			</div>

			<div className="bg-muted rounded-2xl border-3  p-6">
				<div className="flex items-center gap-4 mb-6">
					<div className="flex -space-x-3">
						{[...Array(10)].map((_, i) => (
							<Avatar key={i} className="w-10 h-10 border-2 border-primary">
								<AvatarFallback
									className={`${
										i % 3 === 0
											? "bg-primary text-black"
											: i % 3 === 1
											? "bg-white text-black"
											: "bg-black text-primary border-2 border-primary"
									} text-xs font-bold`}
								>
									U{i + 1}
								</AvatarFallback>
							</Avatar>
						))}
						<div className="w-10 h-10 border-2 border-primary rounded-full bg-white flex items-center justify-center">
							<span className="text-xs font-black">+609</span>
						</div>
					</div>
					<div className="flex-1">
						<div className="text-white font-black text-lg">619 usuarios apuntados</div>
						<div className="text-white/70 text-sm">Se unieron en los últimos 7 días</div>
					</div>
				</div>

				<Button className="w-full bg-primary text-black hover:bg-white font-black text-lg py-6 rounded-2xl border-3 border-primary">
					¡Apuntarme ahora!
				</Button>

				<p className="text-center text-white/70 text-xs mt-4">
					No se realizará ningún cargo hasta alcanzar el objetivo
				</p>
			</div>
		</div>
	);
}
