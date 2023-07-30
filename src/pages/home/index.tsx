import { useState } from 'react';
import Timeline from './columns/timeline';
import UserStatuses from './columns/userStatuses';
import { ReactSortable } from 'react-sortablejs';
import { ColumnType } from './columns';
import Sidebar from './sidebar';
import 'react-modal-video/scss/modal-video.scss';

export default function Home() {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: '1', name: 'Timeline' },
    { id: '2', name: 'UserStatuses', userId: '110644904531275279' },
    { id: '3', name: 'UserStatuses', userId: '107780257626128497' },
  ]);

  if (!document.cookie.includes('access_token')) {
    location.href = '/login';
    return <></>;
  }

  return (
    <div className="flex flex-row">
      <Sidebar columns={columns} setColumns={setColumns} />
      <ReactSortable
        list={columns}
        setList={setColumns}
        className="flex flex-row gap-[3px]"
        handle=".column-dnd-handle"
        animation={300}
      >
        {columns.map((col, idx) => {
          switch (col.name) {
            case 'Timeline':
              return <Timeline num={idx + 1} key="Timeline" />;
            case 'UserStatuses':
              return (
                <UserStatuses
                  num={idx + 1}
                  userId={col.userId}
                  key={'userStatuses-' + col.userId}
                />
              );
          }
        })}
      </ReactSortable>
    </div>
  );
}
