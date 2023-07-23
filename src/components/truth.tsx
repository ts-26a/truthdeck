import { type mastodon } from 'masto';
import { ReplyIcon, RetruthIcon, LikeIcon } from './icon.tsx';
import { useState } from 'react';
import { useApi } from '../hooks';
import ReactTimeAgo from 'react-time-ago';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

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

function TruthBody(status: mastodon.v1.Status & { isLong: boolean }) {
  return (
    <div className="relative box-border">
      {status.isLong ? (
        <>
          <input id="check1" className="peer hidden" type="checkbox" />
          <div
            className={`relative overflow-hidden before:block before:absolute before:bottom-0 before:left-0 before:w-full before:h-[50px] before:content-[''] before:bg-gradient-to-t before:from-white break-all peer-checked:h-auto peer-checked:before:hidden`}
          >
            <div dangerouslySetInnerHTML={{ __html: status.content }} />
          </div>
          <label
            htmlFor="check1"
            className="h-[20px] w-2/3 table absolute bottom-0 left-1/2 -translate-x-1/2 mx-auto my-0 z-20 px-[10px] py-0 bg-blue-500 rounded-xl text-center text-white before:content-['Read_more'] peer-checked:before:content-['Close'] peer-checked:static peer-checked:translate-x-0 hover:bg-blue-600"
          />
        </>
      ) : (
        <div className="h-auto relative overflow-hidden break-all">
          <div dangerouslySetInnerHTML={{ __html: status.content }} />
        </div>
      )}
    </div>
  );
}

function TruthImage(status: mastodon.v1.Status) {
  if (status.mediaAttachments.length == 0) return <></>;
  if (status.mediaAttachments.length == 1) {
    return (
      <Zoom>
        <img
          src={status.mediaAttachments[0].url!}
          className="max-h-[250px] w-full object-cover"
        />
      </Zoom>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-[2px]">
      {status.mediaAttachments.map((media) => {
        return (
          <Zoom>
            <img
              src={media.url!}
              className="row-span-1 w-full h-[125px] rounded-md object-cover"
            />
          </Zoom>
        );
      })}
    </div>
  );
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
              api.v1.statuses.unreblog(status.id).then((st) => {
                setStatus(st);
              });
            } else {
              api.v1.statuses.reblog(status.id).then((st) => {
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
              api.v1.statuses.unfavourite(status.id).then((st) => {
                setStatus(st);
              });
            } else {
              api.v1.statuses.favourite(status.id).then((st) => {
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
  const text = new DOMParser().parseFromString(
    truth.content,
    'text/html',
  ).textContent;
  const isLongTruth = text !== null && text.length > 300;
  return (
    <>
      {isRetruth && (
        <div className="ml-[30px] flex flex-row items-center -mb-[10px] m-[2px]">
          <RetruthIcon className="bg-green-600" size="16px" />
          <span className="truncate">{props.account.displayName}</span>
          <span>Retweeted</span>
        </div>
      )}
      <div className="w-[300px] flex flex-row p-2">
        <div className="h-[40px] aspect-square rounded-md">
          <img
            src={truth.account.avatar}
            className="rounded-md p-[2px]"
            alt={`${truth.account.displayName}'s avatar`}
          />
        </div>
        <div className="flex-1 flex flex-col mr-[3px]">
          <TruthHeader {...truth} />
          <TruthBody {...truth} isLong={isLongTruth} />
          <TruthImage {...truth} />
          <TruthFooter {...truth} />
        </div>
      </div>
      <hr className="border-gray-400" />
    </>
  );
}
