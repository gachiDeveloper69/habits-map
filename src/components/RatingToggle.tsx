import clsx from 'clsx';
import Positive from '@/icons/happy.svg?react';
import Neutral from '@/icons/neutral.svg?react';
import Negative from '@/icons/sad.svg?react';
import type { HabitRating } from '@/types/habits';
import { useCallback } from 'react';

interface RatingToggleProps {
  expanded: boolean;
  rating: HabitRating;
  groupId: string;
  onChange: (newRating: HabitRating) => void;
}

const ICON_BY_RATING = {
  plus: Positive,
  neutral: Neutral,
  minus: Negative,
} as const satisfies Record<HabitRating, React.FC<React.SVGProps<SVGSVGElement>>>;

export function RatingToggle({ expanded, rating, groupId, onChange }: RatingToggleProps) {
  const RatingIcon = ICON_BY_RATING[rating];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        onChange(e.target.value as HabitRating);
      }
    },
    [onChange]
  );

  const name = `rating-${groupId}`;

  return (
    <div className={clsx('habit-row__toggle', expanded && 'habit-row__toggle--expanded')}>
      {/* раскрытый toggle */}
      <div
        className={clsx('toggle', expanded && 'toggle--expanded', `toggle--${rating}`)}
        aria-label="Оценка привычки"
        role="radiogroup"
        onPointerDown={e => e.stopPropagation()}
      >
        <label className="toggle__option toggle__option--minus">
          <input
            name={name}
            className="toggle__input"
            type="radio"
            value="minus"
            checked={rating === 'minus'}
            onChange={handleChange}
          />
          <span className="toggle__pill">
            <Negative />
          </span>
        </label>

        <label className="toggle__option toggle__option--neutral">
          <input
            name={name}
            className="toggle__input"
            type="radio"
            value="neutral"
            checked={rating === 'neutral'}
            onChange={handleChange}
          />
          <span className="toggle__pill">
            <Neutral />
          </span>
        </label>

        <label className="toggle__option toggle__option--plus">
          <input
            name={name}
            className="toggle__input"
            type="radio"
            value="plus"
            checked={rating === 'plus'}
            onChange={handleChange}
          />
          <span className="toggle__pill">
            <Positive />
          </span>
        </label>
      </div>

      {/* свернутая иконка */}
      <div
        className={clsx('toggle__icon', expanded && 'toggle__icon--hidden')}
        aria-hidden={expanded}
      >
        <RatingIcon />
      </div>
    </div>
  );
}
