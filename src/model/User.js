// @flow strict
import { action, computed, observable } from 'mobx';
import type { FollowedUser } from '../Types';
import { ADMIN_GROUP } from '../constants';

export class User {
  @observable name: string;

  @observable email: string;

  @observable group_names: string[];

  @observable id: number;

  @observable followed_users: FollowedUser[];

  /**
   * an user can have permissions to read some resources, while not being authentificated (mostly anonymous, tbqh)
   * hence, we originally use the authentificated boolean to control such flow,
   * mostly the logged layout vs not logged layout
   * while this technically could be easily overwritten by the user on the client, we don't rely on this to actually
   * protect password protected resources.
   */
  authenticated: boolean;

  @action addFollowedUser(followedUser: FollowedUser) {
    this.followed_users.push(followedUser);
  }

  @action removeFollowedUser(followedUserId: number) {
    const index = this.followed_users.findIndex((followedUser: FollowedUser) => followedUser.id === followedUserId);
    this.followed_users.splice(index, 1);
  }

  @computed get hasAdminRights() {
    return this.group_names.indexOf(ADMIN_GROUP) > -1;
  }

  /**
   * If there is a logged user (it's possible there isn't, people can access the map in anonymous mode)
   * then we should not be trying to substitute nicknames for ids
   */
  @computed get nicknamesMap() {
    const map = {};
    const { followed_users, id, name } = this;
    map[id] = name;
    if (!Array.isArray(followed_users) || followed_users.length === 0) {
      return map;
    }
    const assignFollowedUser = (followedUser: FollowedUser) => {
      map[followedUser.id] = followedUser.nickname;
    };
    followed_users.forEach(assignFollowedUser);
    return map;
  }

  @action init(
    name: string,
    email: string,
    groupNames: string[],
    id: number,
    followedUsers: FollowedUser[],
    authenticated: boolean,
  ) {
    this.name = name;
    this.email = email;
    this.group_names = groupNames;
    this.id = id;
    this.followed_users = followedUsers;
    this.authenticated = authenticated;
  }

  constructor(
    name: string,
    email: string,
    groupNames: string[],
    id: number,
    followedUsers: FollowedUser[],
    authenticated: boolean,
  ) {
    this.init(name, email, groupNames, id, followedUsers, authenticated);
  }
}
