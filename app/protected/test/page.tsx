import { GetAllPosts, PostPost } from "@/lib/services/post";
import { InfoIcon } from "lucide-react";

export default async function ProtectedPage() {
	const posts = await GetAllPosts();
	const postPost = await PostPost(["Loquesea", "hola"]);

	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			<div className="w-full">
				<div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
					<InfoIcon size="16" strokeWidth={2} />
					Get all posts:
					<ul>
						{posts
							? posts.map((post) => (
									<li key={post.id}>
										<strong>{post.content}</strong> -{" "}
										{new Date(post.created_at).toLocaleDateString()}
									</li>
							  ))
							: null}
					</ul>
					<p>{postPost && postPost[0].content}</p>
				</div>
			</div>
		</div>
	);
}
