import { createRestAPIClient, type mastodon } from 'masto';
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';

export function useApi(): mastodon.rest.Client {
  const [cookies, _setCookie, _removeCookie] = useCookies();
  return useMemo(() => {
    return createRestAPIClient({
      url: 'https://truthsocial.com',
      accessToken: cookies.access_token,
      requestInit: {
        headers: {
          Accept: 'application/json',
        },
      },
    });
  }, [cookies]);
}
