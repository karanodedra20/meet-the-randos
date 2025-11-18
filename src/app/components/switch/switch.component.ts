import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent {
  checked = input<boolean>(false);
  leftIcon = input<string>('sun');
  rightIcon = input<string>('moon');
  ariaLabel = input<string>('Toggle switch');

  toggle = output<boolean>();

  onToggle(): void {
    this.toggle.emit(!this.checked());
  }
}
