// @flow

class DialogManagerClass {

    dialog_creation_callback: Function | null = null;

    register_dialog_creation_callback = (callback: Function) => {
        if (this.dialog_creation_callback !== null) {
            throw new Error('There should only be one registered dialog creation callback at a time. ' +
                'Only one DialogContainer should be used at a time, are you trying to instantiate multiple ones?');
        }
        this.dialog_creation_callback = callback;
    };

    remove_dialog_creation_callback = () => {
        this.dialog_creation_callback = null;
    };

    confirm = (text: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (typeof this.dialog_creation_callback === 'function') {
                this.dialog_creation_callback(true, text, resolve, reject);
            } else {
                throw new Error('There is no dialog creation callback registered or it is not a function. ' +
                    'Did you instantiate one DialogContainer?');
            }
        });
    };

}

export const DialogManager = new DialogManagerClass();
