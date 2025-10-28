import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { User } from '../../models/user.model';
import { MockResult } from '../../mock-data';
import { UserResult } from '../../models/api-result.model';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserStatsService } from '../../services/user-stats.service';
import { UserGroup } from '../../models/user-group.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userStatsService: UserStatsService;

  const mockedUsers = User.mapFromUserResult(
    MockResult.results as UserResult[]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, ScrollingModule],
      providers: [UserStatsService, provideAnimations()],
    }).compileComponents();

    userStatsService = TestBed.inject(UserStatsService);
    const nationalityCounts =
      userStatsService.calculateNationalityCounts(mockedUsers);

    fixture = TestBed.createComponent(UserListComponent);

    const testGroups: UserGroup[] = [
      { label: 'A', users: mockedUsers, count: mockedUsers.length },
    ];

    fixture.componentRef.setInput('groups', testGroups);
    fixture.componentRef.setInput('nationalityCounts', nationalityCounts);
    fixture.componentRef.setInput('isLoading', false);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept groups input', () => {
    const testGroups: UserGroup[] = [
      { label: 'Test', users: mockedUsers, count: mockedUsers.length },
    ];
    fixture.componentRef.setInput('groups', testGroups);
    fixture.detectChanges();

    expect(component.groups()).toEqual(testGroups);
  });

  it('should accept nationalityCounts input', () => {
    const counts = new Map([['US', 5]]);
    fixture.componentRef.setInput('nationalityCounts', counts);
    fixture.detectChanges();

    expect(component.nationalityCounts()).toEqual(counts);
  });

  it('should initialize with hideScrollbar as false', () => {
    expect(component.hideScrollbar()).toBe(false);
  });

  it('should display loading state when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('groups', []);
    fixture.detectChanges();

    const loadingElement =
      fixture.nativeElement.querySelector('.loading-state');
    expect(loadingElement).toBeTruthy();
  });

  it('should compute virtual scroll rows correctly', () => {
    const testGroups: UserGroup[] = [
      { label: 'Group A', users: mockedUsers.slice(0, 3), count: 3 },
    ];
    fixture.componentRef.setInput('groups', testGroups);
    fixture.detectChanges();

    const rows = component.virtualScrollRows();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].type).toBe('header');
  });

  it('should have correct cardsPerRow value', () => {
    expect(component.cardsPerRow).toBe(3);
  });

  it('should have correct itemSize value', () => {
    expect(component.itemSize).toBe(320);
  });

  it('should clean up timeout on destroy', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    component.ngOnDestroy();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should set hideScrollbar to true after delay', (done) => {
    jest.useFakeTimers();

    // Create new component to test timeout
    const newFixture = TestBed.createComponent(UserListComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('groups', []);
    newFixture.componentRef.setInput('nationalityCounts', new Map());
    newFixture.detectChanges();

    expect(newComponent.hideScrollbar()).toBe(false);

    jest.advanceTimersByTime(5000);
    newFixture.detectChanges();

    expect(newComponent.hideScrollbar()).toBe(true);

    newFixture.destroy();
    jest.useRealTimers();
    done();
  });
});
