import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserItemComponent } from './user-item.component';
import { UserStatsService } from '../../services/user-stats.service';
import { MockResult } from '../../mock-data';
import { User } from '../../models/user.model';
import { UserResult } from '../../models/api-result.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;
  let userStatsService: UserStatsService;

  const mockedUsers = User.mapFromUserResult(
    MockResult.results as UserResult[]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemComponent],
      providers: [UserStatsService, provideAnimations()],
    }).compileComponents();

    userStatsService = TestBed.inject(UserStatsService);
    const nationalityCounts =
      userStatsService.calculateNationalityCounts(mockedUsers);

    fixture = TestBed.createComponent(UserItemComponent);
    fixture.componentRef.setInput('user', mockedUsers[0]);
    fixture.componentRef.setInput('nationalityCounts', nationalityCounts);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the count of users with same nationality', () => {
    const expectedNationalitiesCount = 6;
    expect(component.nationalityCount()).toEqual(expectedNationalitiesCount);
  });

  it('should display user name', () => {
    const nameElement = fixture.nativeElement.querySelector('.user-name');
    expect(nameElement.textContent).toContain(mockedUsers[0].firstname);
    expect(nameElement.textContent).toContain(mockedUsers[0].lastname);
  });

  it('should display username', () => {
    const usernameElement = fixture.nativeElement.querySelector('.username');
    expect(usernameElement.textContent).toContain(
      mockedUsers[0].login?.username
    );
  });

  it('should toggle expanded state on click', () => {
    const initialExpandedState = component.isExpanded();

    const hostElement = fixture.nativeElement;
    hostElement.click();
    fixture.detectChanges();

    expect(component.isExpanded()).toBe(!initialExpandedState);
  });

  it('should display country badge', () => {
    const badgeElement = fixture.nativeElement.querySelector('.badge-country');
    expect(badgeElement).toBeTruthy();
    expect(badgeElement.textContent).toContain(mockedUsers[0].nat);
  });

  it('should have correct initial expanded state', () => {
    expect(component.isExpanded()).toBe(false);
  });

  it('should apply expanded class when isExpanded is true', () => {
    component.isExpanded.set(true);
    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    expect(hostElement.classList.contains('expanded')).toBe(true);
  });

  it('should not have expanded class when isExpanded is false', () => {
    component.isExpanded.set(false);
    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    expect(hostElement.classList.contains('expanded')).toBe(false);
  });
});
