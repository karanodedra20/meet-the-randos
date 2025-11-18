import {
  Component,
  input,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.expanded]': 'isExpanded()',
    '(click)': 'toggleExpand()',
  },
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0',
          opacity: '0',
          padding: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: '1',
        })
      ),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
  ],
})
export class UserItemComponent {
  user = input.required<User>();
  nationalityCounts = input.required<Map<string, number>>();

  isExpanded = signal<boolean>(false);

  nationalityCount = computed(() => {
    const nat = this.user().nat;
    return nat ? this.nationalityCounts().get(nat) || 0 : 0;
  });

  toggleExpand(): void {
    this.isExpanded.update((expanded) => !expanded);
  }
}
