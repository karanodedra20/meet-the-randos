import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-group-header',
  standalone: true,
  templateUrl: './user-group-header.component.html',
  styleUrl: './user-group-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGroupHeaderComponent {
  label = input.required<string>();
  count = input.required<number>();
}
