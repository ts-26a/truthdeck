import { type WsEvents } from 'masto';
import { createContext, useContext } from 'react';

export const UserStreamContext = createContext<WsEvents | undefined>(undefined);

export function useUserStream(): WsEvents {
  const ws = useContext(UserStreamContext);
  if (ws === undefined) throw Error();
  return ws;
}
