import Edit from '@/assets/edit.svg';
import Search from '@/assets/search.svg';
import { SvgIcon } from '@/components/icon';
import { ColumnType } from './columns';
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import Person from '@/assets/person.svg';
import Plus from '@/assets/plus.svg';
import Home from '@/assets/home.svg';
import Notifications from '@/assets/notifications.svg';

export default function Sidebar({
  columns,
  setColumns,
}: {
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
}) {
  return (
    <div className="flex h-screen w-[60px] flex-col items-center gap-[15px] bg-gray-600 p-[10px]">
      <div className="flex aspect-square w-[40px] items-center justify-center rounded-full bg-blue-400">
        <SvgIcon svg={Edit} className="bg-white p-[4px]" size="30px" />
      </div>
      <div className="flex aspect-square w-[40px] items-center justify-center rounded-full bg-blue-400">
        <SvgIcon svg={Search} className="bg-white p-[4px]" size="30px" />
      </div>
      <ReactSortable
        list={columns}
        setList={setColumns}
        className="flex flex-col gap-[5px]"
        animation={300}
      >
        {columns.map((col) => {
          switch (col.name) {
            case 'Timeline':
              return (
                <SvgIcon
                  svg={Home}
                  size="35px"
                  className="bg-gray-300"
                  key="timeline"
                />
              );
            case 'UserStatuses':
              return (
                <SvgIcon
                  svg={Person}
                  size="35px"
                  className="bg-gray-300"
                  key={'user-' + col.id}
                />
              );
            case 'Notifications':
              return (
                <SvgIcon
                  svg={Notifications}
                  size="35px"
                  className="bg-gray-300"
                  key="notifications"
                />
              );
          }
        })}
      </ReactSortable>
      <hr className="w-11/12 text-gray-400" />
      <SvgIcon svg={Plus} size="35px" className="bg-gray-300" />
    </div>
  );
}
