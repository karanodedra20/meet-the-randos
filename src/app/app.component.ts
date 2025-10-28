import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UsersService } from './services/users.service';
import { UserStatsService } from './services/user-stats.service';
import { GroupingService } from './services/grouping.service';
import { ToastService } from './services/toast.service';
import { User } from './models/user.model';
import { GroupingStrategy } from './models/user-group.model';
import { UserListComponent } from './components/user-list/user-list.component';
import { HeaderComponent } from './components/header/header.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { UsersServiceStub } from './services/users.service.stub';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent, HeaderComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private usersService = inject(UsersService);
  private usersMockService = inject(UsersServiceStub); // Mock service
  private userStatsService = inject(UserStatsService);
  private groupingService = inject(GroupingService);
  private toastService = inject(ToastService);

  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  nationalityCounts = signal<Map<string, number>>(new Map());
  isLoading = signal<boolean>(true);

  private searchQuery = '';
  private genderFilter = '';
  private nationalityFilter = '';

  groups = this.groupingService.groups;
  isGrouping = this.groupingService.isGrouping;
  currentStrategy = this.groupingService.currentStrategy;

  constructor() {
    effect(() => {
      const error = this.groupingService.error();
      if (error) {
        this.toastService.error(`Grouping failed: ${error}`);
      }
    });
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.nationalityCounts.set(
          this.userStatsService.calculateNationalityCounts(users)
        );
        this.isLoading.set(false);

        this.groupingService.groupUsers(users, GroupingStrategy.ALPHABETICAL);
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.isLoading.set(false);
        this.toastService.error(
          'Failed to load users. Please check your connection and try again.',
          0 // 0 means the toast won't auto-dismiss
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.groupingService.destroy();
  }

  changeGrouping(strategy: GroupingStrategy): void {
    const usersToGroup = this.filteredUsers();
    this.groupingService.groupUsers(usersToGroup, strategy);
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const gender = this.genderFilter;
    const nationality = this.nationalityFilter;

    let filtered = this.users();

    if (query) {
      filtered = filtered.filter((user) => {
        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        const email = user.email?.toLowerCase() || '';
        const username = user.login?.username?.toLowerCase() || '';

        return (
          fullName.includes(query) ||
          email.includes(query) ||
          username.includes(query)
        );
      });
    }

    if (gender) {
      filtered = filtered.filter((user) => user.gender === gender);
    }

    if (nationality) {
      filtered = filtered.filter((user) => user.nat === nationality);
    }

    this.filteredUsers.set(filtered);

    this.groupingService.groupUsers(
      this.filteredUsers(),
      this.currentStrategy()
    );
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onGenderFilterChange(gender: string): void {
    this.genderFilter = gender;
    this.applyFilters();
  }

  onNationalityFilterChange(nationality: string): void {
    this.nationalityFilter = nationality;
    this.applyFilters();
  }
}
