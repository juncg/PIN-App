import { Button } from "@/components/ui/button";
import { H1, H2 } from "@/components/ui/typography";
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/cards/postCard";
import { PetitionServices } from "./page-services";

export default async function Petitions() {
    const router = useRouter();
    const { petitions } = await PetitionServices();

    return (
        <section className="flex flex-row justify-center gap-8">
            <div className="flex flex-center flex-col gap-8">
                <H1>Peticiones</H1>
                <H2>Esto no esta implementado</H2>
                <Button onClick={() => router.push("/petitions/create")}>Crear una Petición</Button>
            </div>
            <div className="flex flex-col items-baseline gap-8 w-1/2">
                <H1>Peticiones</H1>

                {petitions?.map((petition: IPetition) => (
                    <PostCard
                        key={petition.id}
                        props={{
                            className: "w-full",
                            businessName: "N/A",
                            productDescription: petition.text || "N/A",
                            productName: petition.title || "N/A",
                            typeOfPost: "Petición",
                            peopleSignedCurrent: petition.current_progress || 0,
                            peopleSignedObjective: petition.target_progress || 0,
                        }}
                    />
                ))}
            </div>
        </section>



    );
}