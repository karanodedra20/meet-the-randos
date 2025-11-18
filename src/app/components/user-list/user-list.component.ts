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
  imports: [UserItemComponent, UserGroupHeaderComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnDestroy {
  groups = input.required<UserGroup[]>();
  nationalityCounts = input.required<Map<string, number>>();
  isLoading = input<boolean>(false);
  isPaginated = input<boolean>(false);

  private readonly desktopCardsPerRow = 3;
  private readonly tabletCardsPerRow = 2;
  private readonly mobileCardsPerRow = 1;

  private readonly viewportWidth = signal<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1400
  );

  readonly cardsPerRow = computed<number>(() => {
    const w = this.viewportWidth();
    if (w <= 540) return this.mobileCardsPerRow;
    if (w <= 810) return this.tabletCardsPerRow;
    if (w <= 1080) return this.tabletCardsPerRow;
    return this.desktopCardsPerRow;
  });

  readonly itemSize = 320;
  readonly minBufferPx = 640; // 2 * itemSize
  readonly maxBufferPx = 1280; // 4 * itemSize

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
      const perRow = this.cardsPerRow();
      for (let i = 0; i < users.length; i += perRow) {
        rows.push({
          type: 'users',
          users: users.slice(i, i + perRow),
          groupLabel: group.label,
        });
      }
    }

    return rows;
  });

  /**
   * Non-virtual pagination rows (natural document flow).
   * When paginated we render all rows in normal layout so height is content-driven.
   */
  paginatedRows = computed<VirtualScrollRow[]>(() => {
    if (!this.isPaginated()) {
      return [];
    }
    const rows: VirtualScrollRow[] = [];
    const groups = this.groups();
    for (const group of groups) {
      rows.push({ type: 'header', group, groupLabel: group.label });
      const users = group.users;
      const perRow = this.cardsPerRow();
      for (let i = 0; i < users.length; i += perRow) {
        rows.push({
          type: 'users',
          users: users.slice(i, i + perRow),
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

    if (typeof window !== 'undefined') {
      let pending = false;
      const onResize = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          this.viewportWidth.set(window.innerWidth);
          pending = false;
        });
      };
      window.addEventListener('resize', onResize);
      this._cleanupResize = () =>
        window.removeEventListener('resize', onResize);
    }
  }

  ngOnDestroy(): void {
    if (this.hideScrollbarTimeoutId) {
      clearTimeout(this.hideScrollbarTimeoutId);
    }
    if (this._cleanupResize) this._cleanupResize();
  }

  private _cleanupResize?: () => void;
}
