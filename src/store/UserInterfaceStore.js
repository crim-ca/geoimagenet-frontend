// @flow strict
import { action, observable } from 'mobx';
import { MODE } from '../constants';

const { VISUALIZE } = MODE;

class UserInterfaceStore {

  constructor() {
    const bob = 1;
  }
  @observable selectedMode: string = VISUALIZE;

  @action.bound setMode(mode: string) {
    this.selectedMode = mode;
  }
}

export { UserInterfaceStore };
