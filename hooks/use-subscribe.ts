import { useState } from "react";

interface UseSubscribeProps {
  initialSubscribers: number;
  initialSubscribed: boolean;
}

export function useSubscribe({ initialSubscribers, initialSubscribed }: UseSubscribeProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);

  const toggleSubscribe = () => {
    const newSubscribedState = !isSubscribed;
    const newSubscribersCount = newSubscribedState ? subscribers + 1 : subscribers - 1;

    setIsSubscribed(newSubscribedState);
    setSubscribers(newSubscribersCount);

    return { isSubscribed: newSubscribedState, subscribers: newSubscribersCount };
  };

  return {
    subscribers,
    isSubscribed,
    toggleSubscribe,
  };
}