// @flow strict
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusSquare,
  faCopy,
  faEdit,
  faTrashAlt,
  faQuestionCircle,
  faCheck,
  faPaperPlane,
  faMousePointer,
} from '@fortawesome/free-solid-svg-icons';
import { features } from '../../../features';
import {
  ANNOTATIONS,
  MODE,
  READ,
  VALIDATIONS,
  WRITE,
} from '../../constants';
import type { GeoImageNetStore } from '../../store/GeoImageNetStore';
import { withUserInterfaceStore } from '../../store/HOCs';
import type { UserInterfaceStore } from '../../store/UserInterfaceStore';

const modes = [];
modes.push({
  name: 'eye',
  icon: faMousePointer,
  mode: MODE.VISUALIZATION,
  permission_name: READ,
  resource: ANNOTATIONS,
});
modes.push({
  name: 'creation',
  icon: faPlusSquare,
  mode: MODE.CREATION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
if (features.duplicate) {
  modes.push({
    name: 'duplicate',
    icon: faCopy,
    mode: MODE.DUPLICATION,
    permission_name: WRITE,
    resource: ANNOTATIONS,
  });
}
modes.push({
  name: 'modify',
  icon: faEdit,
  mode: MODE.MODIFICATION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
modes.push({
  name: 'delete',
  icon: faTrashAlt,
  mode: MODE.DELETION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
if (features.expertise) {
  modes.push({
    name: 'ask_expertise',
    icon: faQuestionCircle,
    mode: MODE.ASK_EXPERTISE,
    permission_name: WRITE,
    resource: ANNOTATIONS,
  });
}
modes.push({
  name: 'release',
  icon: faPaperPlane,
  mode: MODE.RELEASE,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
modes.push({
  name: 'validate',
  icon: faCheck,
  mode: MODE.VALIDATION,
  permission_name: WRITE,
  resource: VALIDATIONS,
});

const ActionsContainer = withStyles((theme) => {
  const { values } = theme;
  return {
    root: {
      height: values.heightActionsBar,
    },
  };
})((props) => {
  const { classes, children } = props;
  return <div className={`${classes.root} actions`}>{children}</div>;
});

type Props = {
  state_proxy: GeoImageNetStore,
  ui_store: UserInterfaceStore,
};

/**
 * The different buttons that represent the modes in which an user can act upon the annotations.
 * It should filter the actions based on the access control list.
 */

@observer
class Actions extends Component<Props> {
  setModeCallback = (mode: $Values<typeof MODE>) => () => {
    const { ui_store: { setMode } } = this.props;
    setMode(mode);
  };

  render() {
    const { state_proxy, ui_store: { selectedMode } } = this.props;
    const visibleModes = modes.filter((action) => state_proxy.acl.can(
      action.permission_name,
      action.resource,
    ));

    return (
      <ActionsContainer>
        {
          visibleModes.map((action) => (
            <FontAwesomeIcon
              key={`${action.mode}`}
              icon={action.icon}
              className={action.mode === selectedMode ? 'fa-2x active' : 'fa-2x'}
              onClick={this.setModeCallback(action.mode)}
            />
          ))
        }
      </ActionsContainer>
    );
  }
}

const component = withUserInterfaceStore(Actions);
export { component as Actions };
