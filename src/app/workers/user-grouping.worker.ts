/// <reference lib="webworker" />

import { User } from '../models/user.model';
import {
  GroupingStrategy,
  UserGroup,
  WorkerMessage,
  WorkerMessageType,
} from '../models/user-group.model';

addEventListener('message', ({ data }: MessageEvent<WorkerMessage>) => {
  try {
    if (data.type === WorkerMessageType.GROUP_USERS) {
      const { users, strategy } = data.payload;
      const groups = groupUsers(users, strategy);

      postMessage({
        type: WorkerMessageType.GROUP_USERS_RESULT,
        payload: { groups },
      });
    }
  } catch (error) {
    postMessage({
      type: WorkerMessageType.ERROR,
      payload: { error: (error as Error).message },
    });
  }
});

function groupUsers(users: User[], strategy: GroupingStrategy): UserGroup[] {
  switch (strategy) {
    case GroupingStrategy.ALPHABETICAL:
      return groupByAlphabet(users);
    case GroupingStrategy.AGE:
      return groupByAge(users);
    case GroupingStrategy.NATIONALITY:
      return groupByNationality(users);
    default:
      return [];
  }
}

function groupByAlphabet(users: User[]): UserGroup[] {
  const groupMap = new Map<string, User[]>();

  for (const user of users) {
    const firstLetter = user.firstname?.charAt(0).toUpperCase() || '#';
    if (!groupMap.has(firstLetter)) {
      groupMap.set(firstLetter, []);
    }
    groupMap.get(firstLetter)!.push(user);
  }

  const groups: UserGroup[] = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, groupUsers]) => ({
      label: letter,
      count: groupUsers.length,
      users: groupUsers,
    }));

  return groups;
}

function groupByAge(users: User[]): UserGroup[] {
  const ageRanges = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46-55', min: 46, max: 55 },
    { label: '56-65', min: 56, max: 65 },
    { label: '66+', min: 66, max: 200 },
  ];

  const groups: UserGroup[] = ageRanges.map((range) => ({
    label: range.label,
    count: 0,
    users: [],
  }));

  for (const user of users) {
    const age = user.age;
    if (age) {
      const groupIndex = ageRanges.findIndex(
        (range) => age >= range.min && age <= range.max
      );
      if (groupIndex !== -1) {
        groups[groupIndex].users.push(user);
        groups[groupIndex].count++;
      }
    }
  }

  return groups.filter((group) => group.count > 0);
}

function groupByNationality(users: User[]): UserGroup[] {
  const groupMap = new Map<string, User[]>();

  for (const user of users) {
    const nationality = user.nat || 'Unknown';
    if (!groupMap.has(nationality)) {
      groupMap.set(nationality, []);
    }
    groupMap.get(nationality)!.push(user);
  }

  const groups: UserGroup[] = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([nat, groupUsers]) => ({
      label: nat,
      count: groupUsers.length,
      users: groupUsers,
    }));

  return groups;
}
