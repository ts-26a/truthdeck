import { createStreamingAPIClient, type mastodon } from 'masto';
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';

export function useUserStream(): mastodon.streaming.Client {
  const [cookies, _setCookie, _removeCookie] = useCookies();
  return useMemo(() => {
    return createStreamingAPIClient({
      streamingApiUrl: 'wss://truthsocial.com',
      accessToken: cookies.access_token,
      implementation: WebSocket,
    });
  }, [cookies]);
}
