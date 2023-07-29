import DragIndicator from '@/assets/drag_indicator.svg';
import { SvgIcon } from '@/components/icon';
import { ReactElement } from 'react';
import Person from '@/assets/person.svg';
import Home from '@/assets/home.svg';

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
      <div className="h-[50px] bg-gray-600 px-[2px] flex flex-row">
        <div className="flex flex-col text-gray-200 text-[12px] items-center">
          <span>{num}</span>
          <SvgIcon
            svg={DragIndicator}
            className="w-[10px] h-[28px] column-dnd-handle bg-gray-100 cursor-move"
          />
        </div>
        <div className="flex items-center text-gray-100 font-bold ml-[4px]">
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
    <div className="flex flex-col h-screen w-[300px]">
      <ColumnHeader num={num} name={name} onClick={scrollToTop} />
      <div className="overflow-scroll flex flex-col bg-gray-200">
        {children}
      </div>
    </div>
  );
}
