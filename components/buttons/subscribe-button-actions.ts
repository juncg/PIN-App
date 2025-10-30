"use server";

import {
  GetFromDatabase,
  PostToDatabase,
  PutToDatabase,
} from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user.server";
import { revalidatePath } from "next/cache";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

export async function handleSubscribeAction(
  post_id: number,
  currentlySubscribed: boolean,
  typeOfPost?: "Oferta" | "Petición"
) {
  try {
    const user_id = await getUserUuid();

    if (!user_id) {
      throw new Error("Usuario no autenticado");
    }

    const tableName = typeOfPost === "Petición" ? "Petition" : "Offer";
    const userTableName =
      typeOfPost === "Petición" ? "User_Petition" : "User_Offer";
    const postIdColumn = typeOfPost === "Petición" ? "petition_id" : "offer_id";

    const postSubscribers = await GetFromDatabase<{ current_progress: number }>({
      tableName,
      select: "current_progress",
      filters: [{ method: "eq", column: "id", value: post_id }],
    });

    const currentSubscribers =
      postSubscribers.data && postSubscribers.data.length > 0
        ? postSubscribers.data[0].current_progress
        : 0;

    if (!currentlySubscribed) {
      const existingRelations = await GetFromDatabase({
        tableName: userTableName,
        select: "*",
        filters: [
          { method: "eq", column: "user_id", value: user_id },
          { method: "eq", column: postIdColumn, value: post_id },
        ],
      });

      if (existingRelations.data && existingRelations.data.length > 0) {
        await PutToDatabase({
          tableName: userTableName,
          contentJson: { subscribed: true },
          filters: [
            { method: "eq", column: "user_id", value: user_id },
            { method: "eq", column: postIdColumn, value: post_id },
          ],
        });

      } else {
        await PostToDatabase({
          tableName: userTableName,
          contentJson: {
            user_id: user_id,
            [postIdColumn]: post_id,
            liked: false,
            subscribed: true,
            email_notification: "None",
            native_notification: "None",
          },
        });

      }

      await PutToDatabase({
        tableName,
        contentJson: { current_progress: currentSubscribers + 1 },
        filters: [{ method: "eq", column: "id", value: post_id }],
      });


    } else {
      await PutToDatabase({
        tableName: userTableName,
        contentJson: { subscribed: false },
        filters: [
          { method: "eq", column: "user_id", value: user_id },
          { method: "eq", column: postIdColumn, value: post_id },
        ],
      });

      await PutToDatabase({
        tableName,
        contentJson: { current_progress: Math.max(0, currentSubscribers - 1) },
        filters: [{ method: "eq", column: "id", value: post_id }],
      });

    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
