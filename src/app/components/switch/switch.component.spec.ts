import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchComponent } from './switch.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should have default values', () => {
      expect(component.checked()).toBe(false);
      expect(component.leftIcon()).toBe('sun');
      expect(component.rightIcon()).toBe('moon');
      expect(component.ariaLabel()).toBe('Toggle switch');
    });

    it('should accept checked input', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it('should accept custom icons', () => {
      fixture.componentRef.setInput('leftIcon', 'light');
      fixture.componentRef.setInput('rightIcon', 'dark');
      fixture.detectChanges();

      expect(component.leftIcon()).toBe('light');
      expect(component.rightIcon()).toBe('dark');
    });

    it('should accept custom aria label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Dark mode toggle');
      fixture.detectChanges();

      expect(component.ariaLabel()).toBe('Dark mode toggle');
    });
  });

  describe('onToggle', () => {
    it('should emit toggle event with opposite value when checked is false', () => {
      const toggleSpy = jest.fn();
      component.toggle.subscribe(toggleSpy);

      fixture.componentRef.setInput('checked', false);
      component.onToggle();

      expect(toggleSpy).toHaveBeenCalledWith(true);
    });

    it('should emit toggle event with opposite value when checked is true', () => {
      const toggleSpy = jest.fn();
      component.toggle.subscribe(toggleSpy);

      fixture.componentRef.setInput('checked', true);
      component.onToggle();

      expect(toggleSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('template interactions', () => {
    it('should call onToggle when toggle button is clicked', () => {
      const onToggleSpy = jest.spyOn(component, 'onToggle');
      const toggleElement = compiled.query(By.css('.mini-toggle'));

      toggleElement.nativeElement.click();

      expect(onToggleSpy).toHaveBeenCalled();
    });

    it('should apply active class to moon icon when checked is true', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const moonIcon = compiled.query(By.css('.moon'));
      expect(moonIcon.nativeElement.classList.contains('active')).toBe(true);
    });

    it('should apply active class to sun icon when checked is false', () => {
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();

      const sunIcon = compiled.query(By.css('.sun'));
      expect(sunIcon.nativeElement.classList.contains('active')).toBe(true);
    });
  });
});
