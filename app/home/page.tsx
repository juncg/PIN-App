import { PostCard } from "@/components/cards/postCard";
import { ProductCard } from "@/components/cards/productCard";
import { H1 } from "@/components/ui/typography";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import Link from "next/link";
import { HomeServices } from "./page-services";
import { headers } from "next/headers";
import { getTranslations } from 'next-intl/server';

export default async function Home({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
    const params = await searchParams;
    const locale = params.locale || 'en'; // Default to Spanish
    const t = await getTranslations({ locale, namespace: 'home' });
    
    const { offers, petitions, products } = await HomeServices();
    
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const baseUrl = `http://${host}`;

    return (
        <section className="flex flex-row justify-center gap-8">
            <div className="flex flex-col items-baseline gap-8 w-1/3">
                <Link href={"/offers"}>
                    <H1>{t('petitions')}</H1>
                </Link>

                {petitions?.map((petition: IPetition) => (
                    <PostCard
                        key={petition.id}
                        props={{
                            className: "w-full",
                            businessName: (petition.businesses && petition.businesses[0].business.name) || "N/A",
                            description: petition.text || "N/A",
                            name: petition.title || "N/A",
                            typeOfPost: t('petition'),
                            peopleSignedCurrent: petition.current_progress || 0,
                            peopleSignedObjective: petition.target_progress || 0,
                            likedByUser: petition.liked || false,
                            likes: petition.likes,
                            id: petition.id,
                            baseUrl: baseUrl,
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col items-baseline gap-8 w-1/3">
                <Link href={"/offers"}>
                    <H1>{t('offers')}</H1>
                </Link>

                {offers?.map((offer: IOffer) => (
                    <PostCard
                        key={offer.id}
                        props={{
                            className: "w-full",
                            businessName: offer.businesses?.[0]?.business?.name || "N/A",
                            description: offer.text || "N/A",
                            name: offer.title || "N/A",
                            typeOfPost: t('offer'),
                            peopleSignedCurrent: offer.current_progress || 0,
                            peopleSignedObjective: offer.target_progress || 0,
                            likes: offer.likes,
                            likedByUser: offer.liked || false,
                            id: offer.id,
                            baseUrl: baseUrl,
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col items-baseline gap-8 w-1/3">
                <Link href={"/products"}>
                    <H1>{t('products')}</H1>
                </Link>

                {products?.map((product: IProduct) => (
                    <ProductCard
                        key={product.id}
                        props={{
                            className: "w-full",
                            name: product.name,
                            description: product.description,
                            businessName: (product.businesses && product.businesses[0].business.name) || "N/A",
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
