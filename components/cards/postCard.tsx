import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "../buttons/like-button";
import { ShareComponent } from "../share-post/share";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { H3, H4, P } from "../ui/typography";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

type PostType = "Oferta" | "Petición";

export interface IPostCard {
  className?: string;
  name: string;
  description: string;
  businessName: string;
  typeOfPost: PostType;
  peopleSignedObjective: number;
  peopleSignedCurrent: number;
  likes: number;
  likedByUser: boolean;
  id: number;
  baseUrl?: string;
  tags?: string[];
  images?: string[];
}

// ni pajolera idea de porque lo hace como lo hace, pero consigue lo que queria
function generateRandomPlaceholders(postId: number): string[] {
  const seed = postId;
  const count = (((seed * 9301 + 49297) % 233280) % 3) + 1;

  return Array.from({ length: count }, () => "/placeholder.png");
}

export function PostCard({ props }: { props: IPostCard }) {
  const {
    className,
    businessName,
    description,
    name,
    typeOfPost,
    peopleSignedCurrent,
    peopleSignedObjective,
    likes,
    likedByUser,
    id,
    baseUrl,
    tags = [],
    images,
  } = props;

  const displayImages =
    images && images.length > 0 ? images : generateRandomPlaceholders(id);

  const offerCompletionPercentage = parseFloat(
    ((peopleSignedCurrent * 100) / peopleSignedObjective).toFixed(2)
  );

  const origin =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const postUrl = `${origin}${
    typeOfPost === "Petición" ? `/petitions/${id}` : `/offers/${id}`
  }`;

  return (
    <article
      className={cn(
        "flex flex-col border border-spacing-2 rounded-lg p-4 gap-4",
        className
      )}
    >
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex flex-col gap-2">
          <H3>{name}</H3>
          <H4>{businessName}</H4>
        </div>

        <div className="flex flex-col gap-2">
          <Badge>{typeOfPost}</Badge>
        </div>
      </div>

      <div className="flex flex-col mb-10 gap-4">
        <P>{description}</P>

        <Carousel className="w-full mx-auto max-w-md">
          <CarouselContent>
            {displayImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={image}
                    alt={`${name} - imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {displayImages.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <Link
            href={
              typeOfPost === "Petición" ? `/petitions/${id}` : `/offers/${id}`
            }
          >
            <Button variant="default">Información</Button>
          </Link>
          {typeOfPost === "Oferta" ? (
            <Button>Apúntate a la oferta</Button>
          ) : (
            <Button>Apoya a la petición</Button>
          )}
        </div>

        {typeOfPost === "Oferta" && (
          <div className="flex flex-col gap-2">
            <Progress value={offerCompletionPercentage} />

            <div className="flex justify-between">
              <H4>
                {peopleSignedCurrent} / {peopleSignedObjective}
              </H4>

              <H4>{offerCompletionPercentage}%</H4>
            </div>
          </div>
        )}
        {typeOfPost === "Petición" && (
          <div className="flex flex-col gap-2">
            <Progress value={offerCompletionPercentage} />

            <div className="flex justify-between">
              <H4>
                {peopleSignedCurrent} / {peopleSignedObjective}
              </H4>

              <H4>{offerCompletionPercentage}%</H4>
            </div>
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex">
        <Separator />
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-start gap-6">
          <LikeButton
            likes={likes}
            likedByUser={likedByUser}
            post_id={id}
            typeOfPost={typeOfPost}
          />
          <ShareComponent
            url={postUrl}
            title={name}
            description={description}
          />
        </div>
      </div>
    </article>
  );
}
