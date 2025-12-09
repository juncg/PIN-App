
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient();

export function useNewNotificationsIndicator(userId: string | null) {
    const [hasUnread, setHasUnread] = useState(false);
    


    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`user_${userId}_notifications`)
            .on(
                'postgres_changes',
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'Notification',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newNotification = payload.new as any;
                    if (newNotification.is_read === false) {
                        setHasUnread(true); 
                    }
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]); 

    return hasUnread;
}