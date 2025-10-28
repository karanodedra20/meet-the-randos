import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  signal,
  OnDestroy,
} from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserGroup } from '../../models/user-group.model';
import { User } from '../../models/user.model';
import { UserItemComponent } from '../user-item/user-item.component';
import { UserGroupHeaderComponent } from '../user-group-header/user-group-header.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

/**
 * Represents a row in the virtual scroll list
 * Can be either a group header or a row of user cards
 */
interface VirtualScrollRow {
  type: 'header' | 'users';
  group?: UserGroup;
  users?: User[];
  groupLabel?: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [
    UserItemComponent,
    UserGroupHeaderComponent,
    ScrollingModule,
    SkeletonLoaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnDestroy {
  groups = input.required<UserGroup[]>();
  nationalityCounts = input.required<Map<string, number>>();
  isLoading = input<boolean>(false);

  readonly itemSize = 320;

  readonly cardsPerRow = 3;

  /**
   * Converts groups into virtual scroll rows
   * Each row contains either a header or multiple user cards
   */
  virtualScrollRows = computed<VirtualScrollRow[]>(() => {
    const rows: VirtualScrollRow[] = [];
    const groups = this.groups();

    for (const group of groups) {
      rows.push({
        type: 'header',
        group,
        groupLabel: group.label,
      });

      const users = group.users;
      for (let i = 0; i < users.length; i += this.cardsPerRow) {
        rows.push({
          type: 'users',
          users: users.slice(i, i + this.cardsPerRow),
          groupLabel: group.label,
        });
      }
    }

    return rows;
  });

  private hideScrollbarTimeoutId: any;
  private readonly hideDelayMs = 5000;
  readonly hideScrollbar = signal(false);

  constructor() {
    this.hideScrollbarTimeoutId = setTimeout(() => {
      this.hideScrollbar.set(true);
    }, this.hideDelayMs);
  }

  ngOnDestroy(): void {
    if (this.hideScrollbarTimeoutId) {
      clearTimeout(this.hideScrollbarTimeoutId);
    }
  }
}
