// @flow strict
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPlusSquare,
  faCopy,
  faEdit,
  faTrashAlt,
  faQuestionCircle,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { features } from '../../../features';
import {
  ANNOTATIONS,
  MODE,
  READ,
  VALIDATIONS,
  WRITE,
} from '../../constants';
import { GeoImageNetStore } from '../../store/GeoImageNetStore';
import { withUserInterfaceStore } from '../../store/HOCs';
import { UserInterfaceStore } from '../../store/UserInterfaceStore';

const ACTIONS = [];
ACTIONS.push({
  name: 'eye',
  icon: faEye,
  mode: MODE.VISUALIZE,
  permission_name: READ,
  resource: ANNOTATIONS,
});
ACTIONS.push({
  name: 'creation',
  icon: faPlusSquare,
  mode: MODE.CREATION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
if (features.duplicate) {
  ACTIONS.push({
    name: 'duplicate',
    icon: faCopy,
    mode: MODE.DUPLICATE,
    permission_name: WRITE,
    resource: ANNOTATIONS,
  });
}
ACTIONS.push({
  name: 'modify',
  icon: faEdit,
  mode: MODE.MODIFY,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
ACTIONS.push({
  name: 'delete',
  icon: faTrashAlt,
  mode: MODE.DELETE,
  permission_name: WRITE,
  resource: ANNOTATIONS,
});
if (features.expertise) {
  ACTIONS.push({
    name: 'ask_expertise',
    icon: faQuestionCircle,
    mode: MODE.ASK_EXPERTISE,
    permission_name: WRITE,
    resource: ANNOTATIONS,
  });
}
ACTIONS.push({
  name: 'validate',
  icon: faCheck,
  mode: MODE.VALIDATE,
  permission_name: WRITE,
  resource: VALIDATIONS,
});
ACTIONS.push({
  name: 'refuse',
  icon: faTimes,
  mode: MODE.REJECT,
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
 * This component renders the different buttons that represent the modes in which an user can do actions upon the annotations.
 * It should filter the actions based on the access control list.
 */

@observer
class Actions extends Component<Props> {
  make_set_mode_callback = (mode: $Values<typeof MODE>) => () => {
    const { ui_store: { set_mode } } = this.props;
    set_mode(mode);
  };

  render() {
    const { state_proxy, ui_store } = this.props;

    const visible_actions = ACTIONS.filter((action) => state_proxy.acl.can(action.permission_name, action.resource));

    return (
      <ActionsContainer>
        {
          visible_actions.map((action) => (
            <FontAwesomeIcon
              key={`${action.mode}`}
              icon={action.icon}
              className={action.mode === ui_store.selectedMode ? 'fa-2x active' : 'fa-2x'}
              onClick={this.make_set_mode_callback(action.mode)}
            />
          ))
        }
      </ActionsContainer>
    );
  }
}

const component = withUserInterfaceStore(Actions);
export { component as Actions };
