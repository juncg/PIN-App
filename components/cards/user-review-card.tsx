import { Check, MoreHorizontal, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function UserReviewCard() {
	return (
		<Card key={1} className="p-6">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-start gap-3">
					<Avatar>
						<AvatarImage src="/placeholder.png" />
						<AvatarFallback>Nombre del usuario</AvatarFallback>
					</Avatar>
					<div>
						<div className="flex items-center gap-2 mb-1">
							<span className="font-semibold">Nombre del usuario</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-4 w-4 ${
											i < 4.5 ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
										}`}
									/>
								))}
							</div>
							<span className="text-sm text-muted-foreground">Fecha de la review</span>
						</div>
					</div>
				</div>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</div>

			<h4 className="font-semibold mb-2">Titulo de la reseña</h4>
			<p className="text-muted-foreground mb-4">Contenido de la reseña</p>
		</Card>
	);
}
