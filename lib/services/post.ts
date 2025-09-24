import { Tables } from "../types/supabase";
import { GetClient } from "./general";

const { supabase } = GetClient();

export type PostType = Tables<"Post">;

export async function GetAllPosts(): Promise<PostType[] | null> {
	const { data: posts, error } = await supabase.from("Post").select("*");

	if (error) {
		console.error("Error fetching posts:", error);
	}

	return (posts as PostType[]) || [];
}

export async function PostPost(content: string[]): Promise<PostType[] | null> {
	const { data: post, error } = await supabase
		.from("Post")
		.insert([{ content: content }])
		.select();

	if (error) {
		console.error("Error fetching posts:", error);
	}

	return post;
}
