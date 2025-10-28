import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupingStrategy } from '../../models/user-group.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isGrouping = input<boolean>(false);
  currentStrategy = input<GroupingStrategy>(GroupingStrategy.ALPHABETICAL);

  searchChange = output<string>();
  genderFilterChange = output<string>();
  nationalityFilterChange = output<string>();
  strategyChange = output<GroupingStrategy>();

  searchQuery = signal<string>('');
  genderFilter = signal<string>('');
  nationalityFilter = signal<string>('');

  readonly GroupingStrategy = GroupingStrategy;

  onSearchChange(): void {
    this.searchChange.emit(this.searchQuery());
  }

  onGenderFilterChange(): void {
    this.genderFilterChange.emit(this.genderFilter());
  }

  onNationalityFilterChange(): void {
    this.nationalityFilterChange.emit(this.nationalityFilter());
  }

  changeGrouping(strategy: GroupingStrategy): void {
    this.strategyChange.emit(strategy);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchChange.emit('');
  }
}
