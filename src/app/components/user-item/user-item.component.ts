import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent {
  user = input.required<User>();
  nationalityCounts = input.required<Map<string, number>>();

  /**
   * Get the count of users with same nationality
   */
  nationalityCount = computed(() => {
    const nat = this.user().nat;
    return nat ? this.nationalityCounts().get(nat) || 0 : 0;
  });
}
