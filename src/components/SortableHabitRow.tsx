import type { HabitRowProps } from './HabitRow';
import { HabitRow } from './HabitRow';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

export function SortableHabitRow({
  habit,
  isActive,
  isEditing,
  onActivate,
  onDeactivate,
  onDelete,
  onAddAbove,
  onAddBelow,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
  onUpdateRating,
}: Omit<HabitRowProps, 'dragHandleProps'>) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: habit.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 240ms ease-in-out',
    userSelect: 'none',
    // padding: '12px 12px',
    // borderRadius: 10,
    // border: '1px solid #e5e5e5',
    // background: isDragging ? '#f5f5f5' : 'white',
    // boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.12)' : 'none',
    // marginBottom: 10,
    // display: 'flex',
    // alignItems: 'center',
    // gap: 10,
    // cursor: 'grab',
  };

  return (
    <div
      className={clsx('row-wrapper', isDragging && 'row-wrapper--dragging')}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <HabitRow
        habit={habit}
        isActive={isActive}
        isEditing={isEditing}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        onAddAbove={onAddAbove}
        onAddBelow={onAddBelow}
        onDelete={onDelete}
        onStartEdit={onStartEdit}
        onCancelEdit={onCancelEdit}
        onCommitEdit={onCommitEdit}
        onUpdateRating={onUpdateRating}
        dragHandleProps={listeners}
      />
    </div>
  );
}
