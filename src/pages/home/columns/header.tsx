import DragIndicator from '@/assets/drag_indicator.svg';

export default function ColumnHeader({
  num,
  name,
}: {
  num: number;
  name: string;
}) {
  return (
    <div className="h-[50px] bg-gray-600 px-[2px] flex flex-row">
      <div className="flex flex-col text-gray-200 text-[12px] items-center">
        <span>{num}</span>
        <img src={DragIndicator} className="w-[10px] h-[28px]" />
      </div>
      <div className="flex items-center text-gray-100 font-bold ml-[4px]">
        {name}
      </div>
    </div>
  );
}
