import { CreateForumForm } from "@/components/forms/create-forum-form";
import { CreateForumServices } from "./page-services";

export default async function CreateForumPage() {
	const { businesses } = await CreateForumServices();
	return (
		<section className="max-w-3xl mx-auto space-y-8">
			<h1 className="text-3xl font-bold">Crear Foro</h1>
			<CreateForumForm businesses={businesses} />
		</section>
	);
}
