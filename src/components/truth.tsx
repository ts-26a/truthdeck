import { type mastodon } from 'masto';
import { ReplyIcon, RetruthIcon, LikeIcon, SvgIcon } from './icon.tsx';
import { useState } from 'react';
import { useApi } from '../hooks';
import ReactTimeAgo from 'react-time-ago';
import Lightbox, { ImagesListType } from 'react-spring-lightbox';
import ModalVideo from 'react-modal-video';
import PlayCircle from '@/assets/play_circle.svg';

function TruthHeader(status: mastodon.v1.Status) {
  return (
    <div className="flex h-[40px] flex-col">
      <span className="truncate font-bold">{status.account.displayName}</span>
      <div className="flex truncate text-sm text-gray-700">
        <p className="text-sm text-gray-700">@{status.account.username}</p>
        <span className="px-1">·</span>
        <a href={status.uri} rel="noopener" target="_blank">
          <ReactTimeAgo
            date={Date.parse(status.createdAt)}
            locale="en-US"
            timeStyle="twitter"
            className="text-sm text-gray-700"
          />
        </a>
      </div>
    </div>
  );
}

function TruthBody(status: mastodon.v1.Status) {
  const parser = new DOMParser();
  const text = parser.parseFromString(status.content, 'text/html').body
    .textContent;
  const isLongTruth = text !== null && text.length > 300;
  return (
    <div className="relative box-border">
      {isLongTruth ? (
        <>
          <input id="check1" className="peer hidden" type="checkbox" />
          <div
            className={`relative overflow-hidden break-all before:absolute before:bottom-0 before:left-0 before:block before:h-[50px] before:w-full before:bg-gradient-to-t before:from-white before:content-[''] peer-checked:h-auto peer-checked:before:hidden`}
          >
            <div dangerouslySetInnerHTML={{ __html: status.content }} />
          </div>
          <label
            htmlFor="check1"
            className="absolute bottom-0 left-1/2 z-20 mx-auto my-0 table h-[20px] w-2/3 -translate-x-1/2 rounded-xl bg-blue-500 px-[10px] py-0 text-center text-white before:content-['Read_more'] hover:bg-blue-600 peer-checked:static peer-checked:translate-x-0 peer-checked:before:content-['Close']"
          />
        </>
      ) : (
        <div className="relative h-auto overflow-hidden break-all">
          <div dangerouslySetInnerHTML={{ __html: status.content }} />
        </div>
      )}
    </div>
  );
}

function TruthImage(status: mastodon.v1.Status) {
  const [isOpen, setOpen] = useState(false);
  const [currentImgIdx, setImgIndex] = useState(0);
  if (status.mediaAttachments.length == 0) return <></>;
  if (status.mediaAttachments[0].type === 'video') {
    const video = status.mediaAttachments[0];
    const parser = new DOMParser();
    const embedUrl = parser
      .parseFromString(status.card!.html!, 'text/html')!
      .body.querySelector('iframe')!
      .getAttribute('src')!;
    return (
      <div key={video.id}>
        <ModalVideo
          channel="custom"
          isOpen={isOpen}
          url={embedUrl + '?rel=0'}
          onClose={() => setOpen(false)}
        />
        <button onClick={() => setOpen(true)} className="relative bg-black">
          <img src={video.previewUrl} className="opacity-50" />
          <SvgIcon
            svg={PlayCircle}
            size="50px"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-400"
          />
        </button>
      </div>
    );
  }
  const images: ImagesListType = status.mediaAttachments.map((media) => ({
    src: media.url!,
    loading: 'eager',
    alt: '',
  }));
  const len = status.mediaAttachments.length;
  return (
    <>
      <div
        className={
          'grid grid-cols-2 gap-[4px] ' + (len <= 2 ? 'h-[125px]' : 'h-[254px]')
        }
      >
        {status.mediaAttachments.map((media, idx) => {
          if (len % 2 === 1 && idx === len - 1) {
            return (
              <button
                className="col-span-2 h-[125px] w-full"
                onClick={() => {
                  setImgIndex(idx);
                  setOpen(true);
                }}
                key={media.id}
              >
                <img
                  className="h-[125px] w-full rounded-md object-cover"
                  src={media.previewUrl}
                />
              </button>
            );
          }
          return (
            <button
              className="col-span-1 aspect-square h-[125px] object-cover"
              onClick={() => {
                setImgIndex(idx);
                setOpen(true);
              }}
              key={media.id}
            >
              <img
                className="aspect-square h-[125px] w-[119px] rounded-md object-cover"
                src={media.previewUrl}
              />
            </button>
          );
        })}
      </div>
      <Lightbox
        isOpen={isOpen}
        onPrev={() =>
          currentImgIdx === 0
            ? setImgIndex(images.length - 1)
            : setImgIndex(currentImgIdx - 1)
        }
        onNext={() =>
          currentImgIdx === images.length - 1
            ? setImgIndex(0)
            : setImgIndex(currentImgIdx + 1)
        }
        images={images}
        currentIndex={currentImgIdx}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
function TruthFooter(originalStatus: mastodon.v1.Status) {
  const [status, setStatus] = useState(originalStatus);
  const api = useApi();
  const iconClass = 'flex-1 flex flex-row justify-center items-center gap-1';
  return (
    <div className="mt-[7px] flex h-[20px] w-full flex-row items-center">
      <div className={iconClass}>
        <button>
          <ReplyIcon className="bg-gray-700" size="16px" />
        </button>
        <span>{status.repliesCount}</span>
      </div>
      <div className={iconClass}>
        <button
          onClick={() => {
            if (status.reblogged === true) {
              api.v1.statuses
                .$select(status.id)
                .unreblog()
                .then((st) => {
                  setStatus(st);
                });
            } else {
              api.v1.statuses
                .$select(status.id)
                .reblog()
                .then((st) => {
                  setStatus(st);
                });
            }
          }}
        >
          <RetruthIcon
            className={`${
              status.reblogged === true ? 'bg-green-600' : 'bg-gray-700'
            }`}
            size="16px"
          />
        </button>
        <span>{status.reblogsCount}</span>
      </div>
      <div className={iconClass}>
        <button
          onClick={() => {
            if (status.favourited === true) {
              api.v1.statuses
                .$select(status.id)
                .unfavourite()
                .then((st) => {
                  setStatus(st);
                });
            } else {
              api.v1.statuses
                .$select(status.id)
                .favourite()
                .then((st) => {
                  setStatus(st);
                });
            }
          }}
        >
          <LikeIcon
            className={`${
              status.favourited === true ? 'bg-yellow-500' : 'bg-gray-700'
            }`}
            size="16px"
          />
        </button>
        <span>{status.favouritesCount}</span>
      </div>
    </div>
  );
}

export default function Truth(props: mastodon.v1.Status) {
  const isRetruth = props.reblog !== null && props.reblog !== undefined;
  const truth = isRetruth ? props.reblog! : props;
  return (
    <>
      {isRetruth && (
        <div className="m-[2px] -mb-[10px] ml-[30px] mr-[10px] flex flex-row items-center">
          <RetruthIcon className="shrink-0 bg-green-600" size="16px" />
          <span className="min-w-0 truncate">{props.account.displayName}</span>
          <span>&nbsp;Retweeted</span>
        </div>
      )}
      <div className="flex w-[300px] flex-row p-[10px] pl-[5px]">
        <div className="aspect-square h-[40px] rounded-md">
          <img
            src={truth.account.avatar}
            className="rounded-md p-[2px]"
            alt={`${truth.account.displayName}'s avatar`}
          />
        </div>
        <div className="mr-[3px] flex flex-1 flex-col overflow-hidden">
          <TruthHeader {...truth} />
          <TruthBody {...truth} />
          <TruthImage {...truth} />
          <TruthFooter {...truth} />
        </div>
      </div>
      <hr className="border-gray-400" />
    </>
  );
}
