import { Badge } from "@/components/ui-custom/badge";
import { B1, H4 } from "@/components/ui-custom/typography";
import { IBusiness, IForum, IOffer, IPetition, IProduct, IUser } from "@/lib/services/types";
import Image from "next/image";
import Link from "next/link";

type SearchItem = IOffer | IPetition | IForum | IBusiness | IProduct | IUser;
type ItemType = "offer" | "petition" | "forum" | "business" | "product" | "user";

interface SearchGeneralDropdownItemProps {
	item: SearchItem;
	type: ItemType;
}

export function SearchGeneralDropdownItem({ item, type }: SearchGeneralDropdownItemProps) {
	const getItemData = () => {
		switch (type) {
			case "offer": {
				const offer = item as IOffer;
				return {
					href: `/offers/${offer.id}`,
					title: offer.title,
					subtitle: offer.text?.substring(0, 50),
					tags: offer.tags?.slice(0, 2),
					image: offer?.images?.[0] || "",
				};
			}
			case "petition": {
				const petition = item as IPetition;
				return {
					href: `/petitions/${petition.id}`,
					title: petition.title,
					subtitle: petition.User
						? `${petition.User.name} ${petition.User.surnames || ""}`.trim()
						: undefined,
					tags: petition.tags?.slice(0, 2),
					image: petition?.images?.[0] || "",
				};
			}
			case "forum": {
				const forum = item as IForum;
				return {
					href: `/forums/${forum.id}`,
					title: forum.name,
					subtitle: forum.Business?.name,
					tags: forum.Forum_Tag?.slice(0, 2).map((ft) => ft.Tag),
					image: forum.profile_picture || "",
				};
			}
			case "business": {
				const business = item as IBusiness;
				return {
					href: `/businesses/${business.id}`,
					title: business.name,
					subtitle: business.description?.substring(0, 50),
					tags: undefined,
					image: business.profile_picture || "",
				};
			}
			case "product": {
				const product = item as IProduct;
				return {
					href: `/products/${product.id}`,
					title: product.name,
					subtitle: product.msrp ? `$${product.msrp}` : product.description?.substring(0, 50),
					tags: undefined,
					image: product?.images?.[0] || "",
				};
			}
			case "user": {
				const user = item as IUser;
				return {
					href: `/profile/${user.id}`,
					title: `${user.name} ${user.surnames || ""}`.trim(),
					subtitle: user.username,
					tags: undefined,
					image: user.profile_picture || "",
				};
			}
		}
	};

	const { href, title, subtitle, tags, image } = getItemData();

	return (
		<Link href={href} className="block hover:bg-hover/50 transition-colors">
			<div className="flex gap-4 p-4">
				<div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-lightgrey flex items-center justify-center">
					<Image
						src={image || "/placeholder.png"}
						alt={title || ""}
						fill
						className="object-cover"
						unoptimized
					/>
				</div>

				<div className="flex-1 min-w-0">
					<H4 className="truncate mb-1">{title}</H4>
					{subtitle && <B1 className="text-sm text-lightgrey truncate">{subtitle}</B1>}

					{tags && tags.length > 0 && (
						<div className="flex gap-1 mt-2">
							{tags.map((tag: any, index: number) => (
								<Badge key={index} variant="secondary" className="text-xs">
									{tag.name}
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
