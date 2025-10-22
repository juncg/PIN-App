import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";
import PetitionForm from "@/components/forms/petition-form";
import { getUserUuid } from "@/lib/services/user.server";

export default async function Page() {
  const forums = await GetFromDatabase<IForum>({
    tableName: "Forum",
    select: "*",
  });

  const userId = await getUserUuid();

  return (
    <div className="flex flex-center flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crear una petición</CardTitle>
          <CardDescription>
            Introduce todos los datos para crear una nueva petición
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PetitionForm forums={forums} userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}
