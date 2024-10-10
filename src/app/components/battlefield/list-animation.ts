import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        stagger(
          '60ms',
          animate(
            '600ms ease-out',
            style({ opacity: 1, transform: 'translateY(0px)' })
          )
        ),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        stagger(
          '60ms',
          animate(
            '600ms ease-out',
            style({ opacity: 0, transform: 'translateY(-50px)' })
          )
        ),
      ],
      { optional: true }
    ),
  ]),
]);
