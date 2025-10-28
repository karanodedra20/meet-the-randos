import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { User } from '../../models/user.model';
import { UserItemComponent } from '../user-item/user-item.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [UserItemComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  users = input.required<User[]>();
  nationalityCounts = input.required<Map<string, number>>();

  readonly itemSize = 60;
}
