// @flow strict
import { action, observable } from 'mobx';
import { MODE } from '../constants';

const { VISUALIZATION } = MODE;

class UserInterfaceStore {

  constructor() {
    const bob = 1;
  }
  @observable selectedMode: string = VISUALIZATION;

  @action.bound setMode(mode: string) {
    this.selectedMode = mode;
  }
}

export { UserInterfaceStore };
