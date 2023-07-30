import Edit from '@/assets/edit.svg';
import Search from '@/assets/search.svg';
import { SvgIcon } from '@/components/icon';
import { ColumnType } from './columns';
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import Person from '@/assets/person.svg';
import Plus from '@/assets/plus.svg';
import Home from '@/assets/home.svg';

export default function Sidebar({
  columns,
  setColumns,
}: {
  columns: ColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
}) {
  return (
    <div className="h-screen w-[60px] bg-gray-600 flex flex-col gap-[15px] p-[10px] items-center">
      <div className="rounded-full w-[40px] aspect-square bg-blue-400 flex items-center justify-center">
        <SvgIcon svg={Edit} className="bg-white p-[4px]" size="30px" />
      </div>
      <div className="rounded-full w-[40px] aspect-square bg-blue-400 flex items-center justify-center">
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
          }
        })}
      </ReactSortable>
      <hr className="text-gray-400 w-11/12" />
      <SvgIcon svg={Plus} size="35px" className="bg-gray-300" />
    </div>
  );
}
