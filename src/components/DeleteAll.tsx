import { useState } from 'react';
import Apply from '@/icons/check.svg?react';
import Cancel from '@/icons/cancel.svg?react';
import Trash from '@/icons/delete.svg?react';
import clsx from 'clsx';

import { useLanguage } from '@/i18n/LanguageProvider';

export function DeleteAll({ onDeleteAll }: { onDeleteAll: () => void }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="delete-all-wrap">
      <button
        type="button"
        className="delete-all"
        onClick={() => setConfirmingDelete(v => !v)}
        aria-label={t('deleteAll.ariaLabel')}
      >
        <Trash className="delete-all__icon" />
      </button>

      <div className={clsx('delete-confirm', confirmingDelete && 'delete-confirm--open')}>
        <div className="delete-confirm__text">{t('deleteAll.confirmText')}</div>

        <button
          type="button"
          className="delete-confirm__btn delete-confirm__btn--cancel"
          onClick={() => setConfirmingDelete(false)}
          aria-label={t('deleteAll.cancelLabel')}
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
          aria-label={t('deleteAll.confirmLabel')}
        >
          <Apply />
        </button>
      </div>
    </div>
  );
}
