import Reply from '@/assets/reply.svg';
import Retweet from '@/assets/retweet.svg';
import Star from '@/assets/star.svg';

interface iconProps {
  className?: string;
  width?: string;
  height?: string;
  size?: string;
}

export function SvgIcon(props: iconProps & { svg: string }) {
  return (
    <div
      style={{
        maskImage: `url(${props.svg})`,
        WebkitMaskImage: `url(${props.svg})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        width: props.size || props.width,
        height: props.size || props.height,
      }}
      className={props.className}
    ></div>
  );
}

export function ReplyIcon(props: iconProps) {
  return <SvgIcon svg={Reply} {...props} />;
}

export function RetruthIcon(props: iconProps) {
  return <SvgIcon svg={Retweet} {...props} />;
}

export function LikeIcon(props: iconProps) {
  return <SvgIcon svg={Star} {...props} />;
}
