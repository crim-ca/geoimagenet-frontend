// @flow strict

import type { FollowedUser } from '../Types';

export class User {
  user_name: string;

  email: string;

  group_names: string[];

  id: number;

  followed_users: FollowedUser[];

  constructor(user_name: string, email: string, group_names: string[], id: number, followed_users: FollowedUser[]) {
    this.user_name = user_name;
    this.email = email;
    this.group_names = group_names;
    this.id = id;
    this.followed_users = followed_users;
  }
}
