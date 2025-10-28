import { TestBed } from '@angular/core/testing';
import { UserStatsService } from './user-stats.service';
import { User } from '../models/user.model';

describe('UserStatsService', () => {
  let service: UserStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStatsService],
    });
    service = TestBed.inject(UserStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateNationalityCounts', () => {
    it('should return empty map for empty array', () => {
      const result = service.calculateNationalityCounts([]);
      expect(result.size).toBe(0);
    });

    it('should count single nationality correctly', () => {
      const users: User[] = [
        { nat: 'US' } as User,
        { nat: 'US' } as User,
        { nat: 'US' } as User,
      ];

      const result = service.calculateNationalityCounts(users);
      expect(result.get('US')).toBe(3);
      expect(result.size).toBe(1);
    });

    it('should count multiple nationalities correctly', () => {
      const users: User[] = [
        { nat: 'US' } as User,
        { nat: 'GB' } as User,
        { nat: 'US' } as User,
        { nat: 'DE' } as User,
        { nat: 'GB' } as User,
        { nat: 'GB' } as User,
      ];

      const result = service.calculateNationalityCounts(users);
      expect(result.get('US')).toBe(2);
      expect(result.get('GB')).toBe(3);
      expect(result.get('DE')).toBe(1);
      expect(result.size).toBe(3);
    });

    it('should handle users without nationality', () => {
      const users: User[] = [
        { nat: 'US' } as User,
        { nat: undefined } as User,
        { nat: 'GB' } as User,
      ];

      const result = service.calculateNationalityCounts(users);
      expect(result.get('US')).toBe(1);
      expect(result.get('GB')).toBe(1);
      expect(result.size).toBe(2);
    });

    it('should handle all users without nationality', () => {
      const users: User[] = [
        { nat: undefined } as User,
        { nat: undefined } as User,
      ];

      const result = service.calculateNationalityCounts(users);
      expect(result.size).toBe(0);
    });
  });
});
