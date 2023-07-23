import { type mastodon } from 'masto';
import { createContext, useContext } from 'react';

export const ApiContext = createContext<mastodon.Client | undefined>(undefined);

export function useApi(): mastodon.Client {
  const api = useContext(ApiContext);
  if (api === undefined) throw Error();
  return api;
}
