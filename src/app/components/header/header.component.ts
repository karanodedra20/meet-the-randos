import {
  Component,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupingStrategy } from '../../models/user-group.model';
import { SwitchComponent } from '../switch/switch.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, SwitchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isGrouping = input<boolean>(false);
  currentStrategy = input<GroupingStrategy>(GroupingStrategy.ALPHABETICAL);
  isPaginationEnabled = input<boolean>(false);

  searchChange = output<string>();
  genderFilterChange = output<string>();
  nationalityFilterChange = output<string>();
  strategyChange = output<GroupingStrategy>();
  paginationToggle = output<boolean>();

  searchQuery = signal<string>('');
  genderFilter = signal<string>('');
  nationalityFilter = signal<string>('');

  readonly GroupingStrategy = GroupingStrategy;

  darkMode = signal<boolean>(false);
  paginationEnabled = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('pref-theme');
    if (saved === 'dark') {
      this.enableDarkMode();
    } else if (saved === 'light') {
      this.disableDarkMode();
    } else {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        this.enableDarkMode(false);
      }
    }

    effect(
      () => {
        this.paginationEnabled.set(this.isPaginationEnabled());
      },
      { allowSignalWrites: true }
    );
  }

  toggleDarkMode(): void {
    this.darkMode() ? this.disableDarkMode() : this.enableDarkMode();
  }

  onThemeToggle(checked: boolean): void {
    checked ? this.enableDarkMode() : this.disableDarkMode();
  }

  onPaginationToggle(checked: boolean): void {
    this.paginationEnabled.set(checked);
    this.paginationToggle.emit(checked);
  }

  private enableDarkMode(persist: boolean = true): void {
    document.body.classList.add('dark-theme');
    this.darkMode.set(true);
    if (persist) localStorage.setItem('pref-theme', 'dark');
  }

  private disableDarkMode(persist: boolean = true): void {
    document.body.classList.remove('dark-theme');
    this.darkMode.set(false);
    if (persist) localStorage.setItem('pref-theme', 'light');
  }

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
