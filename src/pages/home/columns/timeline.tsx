import { useState, useEffect, useMemo } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { type mastodon } from 'masto';
import Truth from '@/components/truth';
import { useApi, useUserStream } from '@/hooks';
import { Column } from './column';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Timeline({ num }: { num: number }) {
  const api = useApi();
  const userStream = useUserStream();
  const [truths, setTruths] = useState<mastodon.v1.Status[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const timelinePaginator = useMemo(() => {
    return api.v1.timelines.listHome({ limit: 40 });
  }, []);
  const uuid = useMemo(() => crypto.randomUUID(), []);
  useEffect(() => {
    timelinePaginator.then((tr) => {
      setTruths(tr);
      userStream.on('update', (data) => {
        setTruths((trs) => {
          if (trs.includes(data)) return trs;
          return [data, ...trs];
        });
      });
    });
  }, []);
  const loadMore = async () => {
    const next = await timelinePaginator.next();
    if (next.done === true || next.value === undefined) {
      setHasMore(false);
      return;
    }
    setTruths([...new Set([...truths, ...next.value])]);
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
      <div className="overflow-auto flex flex-col bg-gray-200" id={uuid}>
        <InfiniteScroll
          dataLength={truths.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <BeatLoader className="flex justify-center m-[10px]" key="loader" />
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
