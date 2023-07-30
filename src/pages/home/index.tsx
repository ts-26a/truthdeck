import { useState } from 'react';
import TimelineColumn from './columns/timeline';
import UserStatusesColumn from './columns/userStatuses';
import NottificationsColumn from './columns/notifications';
import { ReactSortable } from 'react-sortablejs';
import { ColumnType } from './columns';
import Sidebar from './sidebar';
import 'react-modal-video/scss/modal-video.scss';

export default function Home() {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: '1', name: 'Timeline' },
    { id: '4', name: 'Notifications' },
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
              return <TimelineColumn num={idx + 1} key="Timeline" />;
            case 'UserStatuses':
              return (
                <UserStatusesColumn
                  num={idx + 1}
                  userId={col.userId}
                  key={'userStatuses-' + col.userId}
                />
              );
            case 'Notifications':
              return <NottificationsColumn num={idx + 1} key="Notification" />;
          }
        })}
      </ReactSortable>
    </div>
  );
}
