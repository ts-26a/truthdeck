import { useState, useEffect, useMemo } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { type mastodon } from 'masto';
import Truth from '@/components/truth';
import { useApi, useUserStream } from '@/hooks';
import { Column } from './column';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SvgIcon } from '@/components/icon';
import Star from '@/assets/star.svg';
import Retweet from '@/assets/retweet.svg';
import ReactTimeAgo from 'react-time-ago';

export default function NottificationsColumn({ num }: { num: number }) {
  const api = useApi();
  const subscription = useUserStream();
  const [notifications, setNotifications] = useState<
    mastodon.v1.Notification[]
  >([]);
  const [maxId, setMaxId] = useState("");
  const uuid = useMemo(() => crypto.randomUUID(), []);
  useEffect(() => {
    api.v1.notifications.list({ limit: 40 }).then((n) => {
      setMaxId(n.slice(-1)[0].id);
      setNotifications(n);
    });
    (async function () {
      for await (const evt of subscription) {
        if (evt.event === 'notification') {
          setNotifications((prev) => [evt.payload, ...prev]);
        }
      }
    })();
  }, []);
  const loadMore = async () => {
    const next = await api.v1.notifications.list({ limit: 40, maxId: maxId });
    setNotifications([...notifications, ...next]);
    setMaxId(next.slice(-1)[0].id);
  };
  return (
    <Column
      num={num}
      name="Notifications"
      scrollToTop={() => {
        document
          .querySelector(`div[id="${uuid}"]`)
          ?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }}
    >
      <div className="flex flex-col overflow-auto bg-gray-200" id={uuid}>
        <InfiniteScroll
          dataLength={notifications.length}
          next={loadMore}
          hasMore={true}
          loader={
            <BeatLoader className="m-[10px] flex justify-center" key="loader" />
          }
          scrollableTarget={uuid}
        >
          {notifications.map((n) => {
            switch (n.type) {
              case 'favourite':
              case 'reblog':
                return (
                  <div
                    className="flex w-[300px] flex-row px-[10px] py-[5px]"
                    key={n.id}
                  >
                    <SvgIcon
                      svg={n.type === 'favourite' ? Star : Retweet}
                      size="16px"
                      className={n.type === 'favourite' ? "bg-yellow-500" : "bg-green-600"}
                    />
                    <div className="flex w-[265px] flex-col">
                      <div className="flex flex-row items-center">
                        <img
                          src={n.account.avatar}
                          className="mr-[2px] w-[24px] rounded-sm"
                        />
                        <span className="flex-1 truncate">
                          {n.account.displayName + " " + (n.type === 'favourite' ? 'liked' : 'retruthed')}
                        </span>
                        <ReactTimeAgo
                          date={Date.parse(n.createdAt)}
                          locale="en-US"
                          timeStyle="twitter"
                        />
                      </div>
                      <div className="flex flex-row gap-[2px] text-sm text-gray-600">
                        <span>{n.status.account.displayName}</span>
                        <span>{'@' + n.status.account.username}</span>
                        <span>·</span>
                        <ReactTimeAgo
                          date={Date.parse(n.status.createdAt)}
                          locale="en-US"
                          timeStyle="twitter"
                        />
                      </div>
                      <div
                        className="text-gray-600"
                        dangerouslySetInnerHTML={{ __html: n.status.content }}
                      />
                    </div>
                  </div>
                );
              case 'mention':
                if (n.status !== null)
                  return <Truth {...n.status} key={n.id} />;
            }
          })}
        </InfiniteScroll>
      </div>
    </Column>
  );
}
