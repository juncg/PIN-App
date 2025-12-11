import { getUserUuid } from "@/lib/services/user";
import { B1, H1 } from "@/components/ui-custom/typography";
import { ForumDetailsService, fetchForumPosts, loadMoreOffers, loadMorePetitions } from "./page-services";
import { ISearchParams } from "@/types";
import { ForumPageClient } from "./page-client";

interface ForumPageProps {
    params: Promise<{
        id: number;
    }>;
    searchParams: Promise<ISearchParams>;
}

export default async function ForumPage({ params, searchParams }: ForumPageProps) {
    const { id } = await params;
    const userUuid = await getUserUuid();
    const {
        forum,
        isFollowing,
        counts,
        categories,
        popularForums,
        businessForums,
        randomForums,
        translator,
        clientTranslations,
    } = await ForumDetailsService(id, searchParams);

    if (!forum || forum.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <H1>Foro no encontrado</H1>
                <B1>El foro que buscas no existe o ha sido eliminado.</B1>
            </div>
        );
    }

    const { offers: initialOffers, petitions: initialPetitions } = await fetchForumPosts(id, 0, 10);

    return (
        <ForumPageClient
            id={id}
            userUuid={userUuid}
            forum={forum}
            isFollowing={isFollowing}
            counts={counts}
            categories={categories}
            popularForums={popularForums}
            businessForums={businessForums}
            randomForums={randomForums}
            clientTranslations={clientTranslations}
            initialOffers={initialOffers}
            initialPetitions={initialPetitions}
            loadMoreOffers={loadMoreOffers.bind(null, id)}
            loadMorePetitions={loadMorePetitions.bind(null, id)}
        />
    );
}
