import { WsEvents, login, type mastodon } from 'masto';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Timeline from './columns/timeline';
import { ApiContext, UserStreamContext } from '@/hooks/';
import UserStatuses from './columns/userStatuses';

export default function Home() {
  const [cookies, _setCookie, _removeCookie] = useCookies();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<mastodon.Client | undefined>();
  const [ws, setWs] = useState<WsEvents | undefined>();
  useEffect(() => {
    login({
      url: 'https://truthsocial.com',
      accessToken: cookies.access_token,
      disableVersionCheck: true,
      defaultRequestInit: {
        headers: {
          Accept: 'application/json',
        },
      },
    })
      .then((d) => {
        setData(d);
        d.v1.stream
          .streamUser()
          .then((ws) => {
            setWs(ws);
            setLoading(false);
          })
          .catch((e) => {
            setError(e);
            setLoading(false);
          });
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
    return () => {
      ws?.disconnect();
    };
  }, []);

  if (!document.cookie.includes('access_token')) {
    location.href = '/login';
    return <></>;
  }

  if (loading) {
    return <div></div>;
  } else if (data !== null) {
    return (
      <ApiContext.Provider value={data}>
        <UserStreamContext.Provider value={ws}>
          <div className="flex flex-row bg-gray-100">
            <Timeline num={1} />
            <div className="h-screen w-[5px] " />
            <UserStatuses num={2} userId="110644904531275279" />
          </div>
        </UserStreamContext.Provider>
      </ApiContext.Provider>
    );
  } else {
    console.log(error);
  }
}
