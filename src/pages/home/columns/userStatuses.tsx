import { useState, useEffect, useMemo } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { type mastodon } from 'masto';
import Truth from '@/components/truth';
import { useApi } from '@/hooks';
import { Column } from './column';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function UserStatuses({
  userId,
  num,
}: {
  userId: string;
  num: number;
}) {
  const api = useApi();
  const [truths, setTruths] = useState<mastodon.v1.Status[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const userStatuseesPaginator = useMemo(() => {
    return api.v1.accounts.$select(userId).statuses.list({ limit: 40 });
  }, []);
  const [minId, setMinId] = useState('');
  const [userName, setUserName] = useState('');
  const uuid = useMemo(() => crypto.randomUUID(), []);
  useEffect(() => {
    userStatuseesPaginator.then((tr) => {
      setTruths(tr);
      setUserName(tr[0]?.account.username);
      setMinId(tr[0].id);
    });
    const interval = setInterval(() => {
      api.v1.accounts
        .$select(userId)
        .statuses.list({ limit: 10, minId: minId })
        .then((tr) => {
          if (tr.length !== 0) {
            setTruths([...tr, ...truths]);
            setMinId(tr[0].id);
          }
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const loadMore = async () => {
    const next = await userStatuseesPaginator.next();
    if (next.done === true || next.value === undefined) {
      setHasMore(false);
      return;
    }
    setTruths([...truths, ...next.value]);
  };

  return (
    <Column
      num={num}
      name={'User @' + userName}
      scrollToTop={() => {
        document
          .querySelector(`div[id="${uuid}"]`)
          ?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }}
    >
      <div className="flex flex-col overflow-auto bg-gray-200" id={uuid}>
        <InfiniteScroll
          dataLength={truths.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <BeatLoader className="m-[10px] flex justify-center" key="loader" />
          }
          scrollableTarget={uuid}
        >
          {truths.map((tr) => (
            <Truth {...tr} key={tr.id} />
          ))}
        </InfiniteScroll>
      </div>
    </Column>
  );
}
