import type { Messages } from '@/i18n/types';

const ru: Messages = {
  emptyState: {
    buttonTitle: 'НАЧНЁМ!',
    buttonText: 'Добавьте свою первую привычку',
  },

  deleteAll: {
    ariaLabel: 'Удалить все привычки',
    cancelLabel: 'Отмена',
    confirmLabel: 'Подтвердить удаление',
    confirmText: 'Удалить все?',
  },

  habitRow: {
    inputArLabel: 'Название привычки',
  },

  header: {
    heading: 'Карта привычек',
  },

  rating: {
    ariaLabel: 'Оценка привычки',
  },

  theme: {
    ariaLabel: 'Переключить тему',
  },

  lang: {
    ariaLabel: 'Переключить язык',
  },

  newHabitName: {
    default: 'Моя новая атомная привычка',
  },

  habitControls: {
    edit: 'Редактировать',
    delete: 'Удалить',
    addAbove: 'Добавить сверху',
    addBelow: 'Добавить снизу',
    apply: 'Сохранить изменения',
    cancel: 'Отменить',
  },
};

export default ru;
