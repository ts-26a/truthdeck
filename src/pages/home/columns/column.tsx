import DragIndicator from '@/assets/drag_indicator.svg';
import { SvgIcon } from '@/components/icon';
import { ReactElement } from 'react';
import Person from '@/assets/person.svg';
import Home from '@/assets/home.svg';
import Notifications from '@/assets/notifications.svg';

function ColumnHeader({
  num,
  name,
  onClick,
}: {
  num: number;
  name: string;
  onClick: () => any;
}) {
  return (
    <button onClick={onClick} className="w-[300px]">
      <div className="flex h-[50px] flex-row bg-gray-600 px-[2px]">
        <div className="flex flex-col items-center text-[12px] text-gray-200">
          <span>{num}</span>
          <SvgIcon
            svg={DragIndicator}
            className="column-dnd-handle h-[28px] w-[10px] cursor-move bg-gray-100"
          />
        </div>
        <div className="ml-[4px] flex items-center font-bold text-gray-100">
          {(() => {
            if (name === 'Timeline') {
              return (
                <SvgIcon
                  svg={Home}
                  className="aspect-square bg-gray-300"
                  size="30px"
                />
              );
            } else if (name.startsWith('User')) {
              return (
                <SvgIcon
                  svg={Person}
                  className="aspect-square bg-gray-300"
                  size="30px"
                />
              );
            }  else if (name === "Notifications") {
              return (
                <SvgIcon
                  svg={Notifications}
                  className="aspect-square bg-gray-300"
                  size="30px"
                />
              )
            }
          })()}
          {name}
        </div>
      </div>
    </button>
  );
}

export function Column({
  num,
  name,
  children,
  scrollToTop,
}: {
  num: number;
  name: string;
  children: ReactElement;
  scrollToTop: () => any;
}) {
  return (
    <div className="flex h-screen w-[300px] flex-col">
      <ColumnHeader num={num} name={name} onClick={scrollToTop} />
      <div className="flex flex-col overflow-scroll bg-gray-200">
        {children}
      </div>
    </div>
  );
}
