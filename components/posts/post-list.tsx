import { TPost } from "@/types";
import { PostCard } from "../cards/postCard";

export function PostList({ items }: { items: TPost[] }) {
	return (
		<div className="grid gap-4">
			{items.length === 0 ? (
				<p className="text-muted-foreground">No se encontraron ofertas</p>
			) : (
				items.map((item) => {
					return (
						<PostCard
							key={item.id}
							props={{
								className: "w-full",
								post: item,
							}}
						/>
					);
				})
			)}
		</div>
	);
}
