import { useState, useEffect, useMemo } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { type mastodon } from 'masto';
import InfScroll from './infinite_scroll';
import Truth from '@/components/truth';
import { useApi } from '@/hooks';
import ColumnHeader from './header';

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
    return api.v1.accounts.listStatuses(userId, { limit: 40 });
  }, []);
  const [userName, setUserName] = useState('');
  useEffect(() => {
    userStatuseesPaginator.then((tr) => {
      setTruths(tr);
      setUserName(tr[0]?.account.username);
    });
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
    <div className="flex flex-col h-screen">
      <ColumnHeader num={num} name={'@' + userName} />
      <InfScroll
        dataLength={truths.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <BeatLoader className="flex justify-center m-[10px]" key="loader" />
        }
      >
        {truths.map((tr) => (
          <Truth {...tr} key={tr.id} />
        ))}
      </InfScroll>
    </div>
  );
}
