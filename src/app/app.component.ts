import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UsersService } from './services/users.service';
import { UserStatsService } from './services/user-stats.service';
import { User } from './models/user.model';
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
export class AppComponent implements OnInit {
  private usersService = inject(UsersService);
  private usersMockService = inject(UsersServiceStub); // Mock service
  private userStatsService = inject(UserStatsService);

  users = signal<User[]>([]);
  nationalityCounts = signal<Map<string, number>>(new Map());

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.users.set(users);
      this.nationalityCounts.set(
        this.userStatsService.calculateNationalityCounts(users)
      );
    });
  }
}
