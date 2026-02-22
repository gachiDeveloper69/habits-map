import { useState } from 'react';
import Apply from '@/icons/check.svg?react';
import Cancel from '@/icons/cancel.svg?react';
import Trash from '@/icons/delete.svg?react';
import clsx from 'clsx';

export function DeleteAll({ onDeleteAll }: { onDeleteAll: () => void }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  return (
    <div className="delete-all-wrap">
      <button
        type="button"
        className="delete-all"
        onClick={() => setConfirmingDelete(v => !v)}
        aria-label="Удалить все привычки"
      >
        <Trash className="delete-all__icon" />
      </button>

      <div className={clsx('delete-confirm', confirmingDelete && 'delete-confirm--open')}>
        <div className="delete-confirm__text">Удалить все?</div>

        <button
          type="button"
          className="delete-confirm__btn delete-confirm__btn--cancel"
          onClick={() => setConfirmingDelete(false)}
          aria-label="Отмена"
        >
          <Cancel />
        </button>

        <button
          type="button"
          className="delete-confirm__btn delete-confirm__btn--apply"
          onClick={() => {
            onDeleteAll();
            setConfirmingDelete(false);
          }}
          aria-label="Подтвердить удаление"
        >
          <Apply />
        </button>
      </div>
    </div>
  );
}
