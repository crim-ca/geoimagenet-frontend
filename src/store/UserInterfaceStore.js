// @flow strict
import { action, observable } from 'mobx'

class UserInterfaceStore {
  @observable mode_selected: string

  @action setMode(mode: string) {
    this.mode_selected = mode
  }
}

export { UserInterfaceStore }
