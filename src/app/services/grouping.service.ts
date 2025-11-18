import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import {
  GroupingStrategy,
  UserGroup,
  WorkerMessage,
  WorkerMessageType,
} from '../models/user-group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupingService {
  private worker?: Worker;

  currentStrategy = signal<GroupingStrategy>(GroupingStrategy.ALPHABETICAL);

  isGrouping = signal<boolean>(false);

  groups = signal<UserGroup[]>([]);

  error = signal<string | null>(null);

  private initWorker(): void {
    if (typeof Worker !== 'undefined' && !this.worker) {
      this.worker = new Worker(
        new URL('../workers/user-grouping.worker', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
        if (data.type === WorkerMessageType.GROUP_USERS_RESULT) {
          this.groups.set(data.payload.groups);
          this.isGrouping.set(false);
          this.error.set(null);
        } else if (data.type === WorkerMessageType.ERROR) {
          this.error.set(data.payload.error);
          this.isGrouping.set(false);
        }
      };

      this.worker.onerror = (error) => {
        this.error.set(`Worker error: ${error.message}`);
        this.isGrouping.set(false);
      };
    }
  }

  groupUsers(users: User[], strategy: GroupingStrategy): void {
    this.initWorker();

    if (!this.worker) {
      this.error.set('Web Workers not supported in this browser');
      return;
    }

    this.isGrouping.set(true);
    this.currentStrategy.set(strategy);
    this.error.set(null);

    this.worker.postMessage({
      type: WorkerMessageType.GROUP_USERS,
      payload: { users, strategy },
    });
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }
}
