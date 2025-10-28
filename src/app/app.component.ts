import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UsersService } from './services/users.service';
import { UserStatsService } from './services/user-stats.service';
import { GroupingService } from './services/grouping.service';
import { User } from './models/user.model';
import { GroupingStrategy } from './models/user-group.model';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersServiceStub } from './services/users.service.stub';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private usersService = inject(UsersService);
  private usersMockService = inject(UsersServiceStub); // Mock service
  private userStatsService = inject(UserStatsService);
  private groupingService = inject(GroupingService);

  users = signal<User[]>([]);
  nationalityCounts = signal<Map<string, number>>(new Map());
  isLoading = signal<boolean>(true);

  groups = this.groupingService.groups;
  isGrouping = this.groupingService.isGrouping;
  currentStrategy = this.groupingService.currentStrategy;

  readonly GroupingStrategy = GroupingStrategy;

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.users.set(users);
      this.nationalityCounts.set(
        this.userStatsService.calculateNationalityCounts(users)
      );
      this.isLoading.set(false);

      this.groupingService.groupUsers(users, GroupingStrategy.ALPHABETICAL);
    });
  }

  ngOnDestroy(): void {
    this.groupingService.destroy();
  }

  changeGrouping(strategy: GroupingStrategy): void {
    this.groupingService.groupUsers(this.users(), strategy);
  }
}
