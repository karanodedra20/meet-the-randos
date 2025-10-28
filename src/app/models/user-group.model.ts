import { User } from './user.model';

/**
 * Represents a group of users with a label and items
 */
export interface UserGroup {
  label: string;
  count: number;
  users: User[];
}

/**
 * Available grouping strategies
 */
export enum GroupingStrategy {
  ALPHABETICAL = 'alphabetical',
  AGE = 'age',
  NATIONALITY = 'nationality',
}

/**
 * Message types for Web Worker communication
 */
export enum WorkerMessageType {
  GROUP_USERS = 'GROUP_USERS',
  GROUP_USERS_RESULT = 'GROUP_USERS_RESULT',
  ERROR = 'ERROR',
}

/**
 * Request message to group users
 */
export interface GroupUsersRequest {
  type: WorkerMessageType.GROUP_USERS;
  payload: {
    users: User[];
    strategy: GroupingStrategy;
  };
}

/**
 * Response message with grouped users
 */
export interface GroupUsersResponse {
  type: WorkerMessageType.GROUP_USERS_RESULT;
  payload: {
    groups: UserGroup[];
  };
}

/**
 * Error message from worker
 */
export interface WorkerErrorMessage {
  type: WorkerMessageType.ERROR;
  payload: {
    error: string;
  };
}

/**
 * Union type for all worker messages
 */
export type WorkerMessage =
  | GroupUsersRequest
  | GroupUsersResponse
  | WorkerErrorMessage;
