import InfiniteScroll, { Props } from 'react-infinite-scroll-component';

export default function InfScroll(props: Omit<Props, 'scrollableTarget'>) {
  const uuid = crypto.randomUUID();
  return (
    <div className="overflow-auto flex flex-col bg-gray-200" id={uuid}>
      <InfiniteScroll {...props} scrollableTarget={uuid} />
    </div>
  );
}
