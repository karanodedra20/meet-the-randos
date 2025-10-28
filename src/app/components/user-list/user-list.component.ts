import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserGroup } from '../../models/user-group.model';
import { User } from '../../models/user.model';
import { UserItemComponent } from '../user-item/user-item.component';
import { UserGroupHeaderComponent } from '../user-group-header/user-group-header.component';

/**
 * Represents an item in the virtual scroll list
 * Can be either a group header or a user item
 */
interface ListItem {
  type: 'header' | 'user';
  group?: UserGroup;
  user?: User;
  groupLabel?: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [UserItemComponent, UserGroupHeaderComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  groups = input.required<UserGroup[]>();
  nationalityCounts = input.required<Map<string, number>>();
  isLoading = input<boolean>(false);

  readonly itemSize = 60;

  /**
   * Flattens groups into a single array with headers and users
   * for virtual scrolling
   */
  flattenedItems = computed<ListItem[]>(() => {
    const items: ListItem[] = [];
    const groups = this.groups();

    for (const group of groups) {
      // Add group header
      items.push({
        type: 'header',
        group,
        groupLabel: group.label,
      });

      // Add all users in this group
      for (const user of group.users) {
        items.push({
          type: 'user',
          user,
          groupLabel: group.label,
        });
      }
    }

    return items;
  });
}
