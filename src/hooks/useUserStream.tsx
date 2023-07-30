import { createStreamingAPIClient, type mastodon } from 'masto';
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';

export function useUserStream(): mastodon.streaming.Subscription {
  const [cookies, _setCookie, _removeCookie] = useCookies();
  const subscription = useMemo(() => {
    return createStreamingAPIClient({
      streamingApiUrl: 'wss://truthsocial.com',
      accessToken: cookies.access_token,
      implementation: WebSocket,
    }).user.subscribe();
  }, [cookies]);
  return subscription;
}
