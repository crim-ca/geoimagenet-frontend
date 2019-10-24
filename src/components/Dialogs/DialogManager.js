// @flow strict

type DialogCreationCallback = (
  text: string,
  handle_accept: () => void,
  handle_refuse: () => void,
) => void

class DialogManagerClass {

  dialog_creation_callback: DialogCreationCallback | null = null

  register_dialog_creation_callback = (callback: DialogCreationCallback) => {
    if (typeof callback !== 'function') {
      throw new Error('The dialog creation callback should be a function.')
    }
    if (this.dialog_creation_callback !== null) {
      throw new Error('There should only be one registered dialog creation callback at a time. ' +
        'Only one DialogContainer should be used at a time, are you trying to instantiate multiple ones?')
    }
    this.dialog_creation_callback = callback
  }

  remove_dialog_creation_callback = () => {
    this.dialog_creation_callback = null
  }

  /**
   * @param {string} text
   * @returns {Promise<R>}
   */
  confirm = (text: string): Promise<void> => {

    return new Promise((resolve, reject) => {
      if (typeof this.dialog_creation_callback === 'function') {
        return this.dialog_creation_callback(text, resolve, reject)
      }
      if (this.dialog_creation_callback === null) {
        reject('There is no dialog creation callback registered. Did you instantiate a DialogContainer?')
      }
      reject('The dialog creation callback registered is not a function. ' +
        'Did you instantiate a DialogContainer?')
    })


  }

}

export const DialogManager = new DialogManagerClass()
