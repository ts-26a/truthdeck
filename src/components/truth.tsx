import { type mastodon } from 'masto';
import { ReplyIcon, RetruthIcon, LikeIcon, SvgIcon } from './icon.tsx';
import { useState } from 'react';
import { useApi } from '../hooks';
import ReactTimeAgo from 'react-time-ago';
import ModalImage from 'react-modal-image';
import ModalVideo from 'react-modal-video';
import PlayCircle from '@/assets/play_circle.svg';

function TruthHeader(status: mastodon.v1.Status) {
  return (
    <div className="flex flex-col h-[40px]">
      <span className="font-bold truncate">{status.account.displayName}</span>
      <div className="flex truncate text-gray-700 text-sm">
        <p className="text-gray-700 text-sm">@{status.account.username}</p>
        <span className="px-1">·</span>
        <a href={status.uri} rel="noopener" target="_blank">
          <ReactTimeAgo
            date={Date.parse(status.createdAt)}
            locale="en-US"
            timeStyle="twitter"
            className="text-gray-700 text-sm"
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
            className={`relative overflow-hidden before:block before:absolute before:bottom-0 before:left-0 before:w-full before:h-[50px] before:content-[''] before:bg-gradient-to-t before:from-white break-all peer-checked:h-auto peer-checked:before:hidden`}
          >
            <div dangerouslySetInnerHTML={{__html: status.content}} />
          </div>
          <label
            htmlFor="check1"
            className="h-[20px] w-2/3 table absolute bottom-0 left-1/2 -translate-x-1/2 mx-auto my-0 z-20 px-[10px] py-0 bg-blue-500 rounded-xl text-center text-white before:content-['Read_more'] peer-checked:before:content-['Close'] peer-checked:static peer-checked:translate-x-0 hover:bg-blue-600"
          />
        </>
      ) : (
        <div className="h-auto relative overflow-hidden break-all">
          <div dangerouslySetInnerHTML={{__html: status.content}} />
        </div>
      )}
    </div>
  );
}

function TruthImage(status: mastodon.v1.Status) {
  const [isOpen, setOpen] = useState(false);
  if (status.mediaAttachments.length == 0) return <></>;
  if (status.mediaAttachments[0].type === 'video') {
    const video = status.mediaAttachments[0];
    const parser = new DOMParser();
    const embedUrl = parser.parseFromString(status.card!.html!, 'text/html')!.body.querySelector("iframe")!.getAttribute("src")!;
    return (
      <div key={video.id}>
        <ModalVideo channel="custom" isOpen={isOpen} url={embedUrl + "?rel=0"} onClose={() => setOpen(false)} />
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
  return <div className='flex flex-col w-full gap-[5px]'>
    {
      status.mediaAttachments.map((media) =>
        <ModalImage
        small={media.previewUrl}
        large={media.url!}
        showRotate={true}
        className={"object-cover rounded-md w-full h-[100px]"}
        key={media.id}
        />
      )
    }
  </div>
}
function TruthFooter(originalStatus: mastodon.v1.Status) {
  const [status, setStatus] = useState(originalStatus);
  const api = useApi();
  const iconClass = 'flex-1 flex flex-row justify-center items-center gap-1';
  return (
    <div className="flex flex-row w-full h-[20px] items-center mt-[7px]">
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
        <div className="ml-[30px] flex flex-row items-center -mb-[10px] m-[2px] mr-[10px]">
          <RetruthIcon className="bg-green-600 shrink-0" size="16px" />
          <span className="truncate min-w-0">{props.account.displayName}</span>
          <span>&nbsp;Retweeted</span>
        </div>
      )}
      <div className="w-[300px] flex flex-row pl-[5px] p-[10px]">
        <div className="h-[40px] aspect-square rounded-md">
          <img
            src={truth.account.avatar}
            className="rounded-md p-[2px]"
            alt={`${truth.account.displayName}'s avatar`}
          />
        </div>
        <div className="flex-1 overflow-hidden flex flex-col mr-[3px]">
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
