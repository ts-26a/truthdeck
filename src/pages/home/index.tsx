import { WsEvents, login, type mastodon } from 'masto';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Timeline from './columns/timeline';
import { ApiContext, UserStreamContext } from '@/hooks/';
import UserStatuses from './columns/userStatuses';
import { ReactSortable } from 'react-sortablejs';
import { ColumnType } from './columns';
import Sidebar from './sidebar';

export default function Home() {
  const [cookies, _setCookie, _removeCookie] = useCookies();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<mastodon.Client | undefined>();
  const [ws, setWs] = useState<WsEvents | undefined>();
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: '1', name: 'Timeline' },
    { id: '2', name: 'UserStatuses', userId: '110644904531275279' },
    { id: '3', name: 'UserStatuses', userId: '107780257626128497' },
  ]);
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
    return ws?.disconnect;
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
          <div className="flex flex-row">
            <Sidebar columns={columns} setColumns={setColumns} />
            <ReactSortable
              list={columns}
              setList={setColumns}
              className="flex flex-row gap-[3px]"
              handle=".column-dnd-handle"
              animation={300}
            >
              {columns.map((col, idx) => {
                switch (col.name) {
                  case 'Timeline':
                    return <Timeline num={idx + 1} key="Timeline" />;
                  case 'UserStatuses':
                    return (
                      <UserStatuses
                        num={idx + 1}
                        userId={col.userId}
                        key={'userStatuses-' + col.userId}
                      />
                    );
                }
              })}
            </ReactSortable>
          </div>
        </UserStreamContext.Provider>
      </ApiContext.Provider>
    );
  } else {
    console.log(error);
  }
}
