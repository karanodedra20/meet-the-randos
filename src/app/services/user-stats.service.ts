import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStatsService {
  calculateNationalityCounts(users: User[]): Map<string, number> {
    const counts = new Map<string, number>();

    for (const user of users) {
      if (user.nat) {
        counts.set(user.nat, (counts.get(user.nat) || 0) + 1);
      }
    }

    return counts;
  }
}
