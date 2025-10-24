"use server";

import { GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user.server";

export async function handleLikeAction(post_id: number, currentlyLiked: boolean) {
  try {
    const user_id = await getUserUuid();
    if (!user_id) {
      throw new Error("Usuario no autenticado");
    }

    console.log("User ID:", user_id);
    console.log("Post ID:", post_id);
    console.log("Currently Liked:", currentlyLiked);

    const postLikes = await GetFromDatabase<{ likes: number }>({tableName: "Offer", select: "likes", eq: ["id", post_id]});

    const currentLikes = postLikes[0]?.likes || 0;

    if (!currentlyLiked) {
      // El usuario quiere dar like
      // Verificar si ya existe una relación entre el usuario y la oferta
      const existingRelations = await GetFromDatabase({tableName: "User_Offer", select: "*", eq: ["user_id", user_id], additionalEqs: [["offer_id", post_id]]});

      if (existingRelations && existingRelations.length > 0) {
        // Si existe, actualizar el valor de liked a true
        await PutToDatabase({ tableName: "User_Offer", contentJson: { liked: true }, matchColumn: "user_id", matchValue: user_id, additionalMatches: [["offer_id", post_id]]});
      
      } else {
        // Si no existe, crear una nueva entrada
        await PostToDatabase({
          tableName: "User_Offer",
          contentJson: [{
            user_id: user_id,
            offer_id: post_id,
            liked: true,
            subscribed: false,
            email_notifications: false,
            email_notification_state: "None",
            native_notifications: false,
            native_notification_state: "None",
          }],
        });
      }

      await PutToDatabase({tableName: "Offer", contentJson: { likes: currentLikes + 1 }, matchColumn: "id", matchValue: post_id});
      
    } else {
      // El usuario quiere quitar el like
      await PutToDatabase({tableName: "User_Offer",contentJson: { liked: false },matchColumn: "user_id",matchValue: user_id,additionalMatches: [["offer_id", post_id]]});

      await PutToDatabase({tableName: "Offer",contentJson: { likes: Math.max(0, currentLikes - 1) }, matchColumn: "id", matchValue: post_id});
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating like:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}
