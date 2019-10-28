// @flow strict
import { action, observable } from 'mobx';
import { MODE } from '../constants';

const { VISUALIZE } = MODE;

class UserInterfaceStore {
  @observable selectedMode: string = VISUALIZE;

  @action setMode(mode: string) {
    this.selectedMode = mode;
  }
}

export { UserInterfaceStore };
