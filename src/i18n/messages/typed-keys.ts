type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object ? Join<K, NestedKeyOf<T[K]>> : K;
    }[keyof T & (string | number)]
  : never;
