import { useState, useEffect, useMemo } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { type mastodon } from 'masto';
import Truth from '@/components/truth';
import { useApi, useUserStream } from '@/hooks';
import { Column } from './column';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function TimelineColumn({ num }: { num: number }) {
  const api = useApi();
  const subscription = useUserStream();
  const [truths, setTruths] = useState<mastodon.v1.Status[]>([]);
  const uuid = useMemo(() => crypto.randomUUID(), []);
  const [maxId, setMaxId] = useState('');
  useEffect(() => {
    api.v1.timelines.home.list({ limit: 40 }).then((tr) => {
      setTruths(tr);
      setMaxId(tr.slice(-1)[0].id);
    });
    (async function () {
      for await (const evt of subscription) {
        if (evt.event === 'update') {
          setTruths((prev) => [evt.payload, ...prev]);
        }
      }
    })();
  }, []);
  const loadMore = async () => {
    const next = await api.v1.timelines.home.list({ limit: 40, maxId: maxId });
    setTruths([...truths, ...next]);
    setMaxId(next.slice(-1)[0].id);
  };
  return (
    <Column
      num={num}
      name="Timeline"
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
          hasMore={true}
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
