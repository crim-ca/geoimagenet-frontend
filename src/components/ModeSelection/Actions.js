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
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { withUserInterfaceStore } from '../../model/HOCs';
import type { UserInterfaceStore } from '../../model/store/UserInterfaceStore';
import { CustomTooltip } from '../CustomTooltip';


const mapModes = [];
const reviewModes = [];

mapModes.push({
  name: 'Navigate',
  icon: faMousePointer,
  mode: MODE.VISUALIZATION,
  permission_name: READ,
  resource: ANNOTATIONS,
  tooltip: 'Activate this mode to navigate to the different annotations. Filters can also be set (See map buttons)',
});
mapModes.push({
  name: 'Create',
  icon: faPlusSquare,
  mode: MODE.CREATION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
  tooltip: 'Activate this mode to create new annotations. Click on the name of a taxonomy class above to select it and then click on the map to create the annotation. Double-click to complete it.',
});
if (features.duplicate) {
  mapModes.push({
    name: 'duplicate',
    icon: faCopy,
    mode: MODE.DUPLICATION,
    permission_name: WRITE,
    resource: ANNOTATIONS,
    tooltip: 'To do',
  });
}
mapModes.push({
  name: 'Edit',
  icon: faEdit,
  mode: MODE.MODIFICATION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
  tooltip: 'Activate this mode to edit an annotation. Click and hold on any point along the edge of an annotation to change it\'s shape.',
});
mapModes.push({
  name: 'Delete',
  icon: faTrashAlt,
  mode: MODE.DELETION,
  permission_name: WRITE,
  resource: ANNOTATIONS,
  tooltip: 'Activate this mode to delete an annotation. Click on the annotation you want to delete.',
});
if (features.expertise) {
  reviewModes.push({
    name: 'ask_expertise',
    icon: faQuestionCircle,
    mode: MODE.ASK_EXPERTISE,
    permission_name: WRITE,
    resource: ANNOTATIONS,
    tooltip: 'To do',
  });
}
reviewModes.push({
  name: 'Release',
  icon: faPaperPlane,
  mode: MODE.RELEASE,
  permission_name: WRITE,
  resource: ANNOTATIONS,
  tooltip: 'Activate this mode to release annotations.',
});
reviewModes.push({
  name: 'Validate',
  icon: faCheck,
  mode: MODE.VALIDATION,
  permission_name: WRITE,
  resource: VALIDATIONS,
  tooltip: 'Activate this mode to validate annotations. Each annotation can be set as either validated or rejected.',
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

const VerticalLine = withStyles((theme) => ({
  root: {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    height: '60px',
    left: '50%',
    marginLeft: '-1px',
  },
}))((props) => {
  const { classes, children } = props;
  return <div className={`${classes.root}`}>{children}</div>;
});


type Props = {
  geoImageNetStore: GeoImageNetStore,
  uiStore: UserInterfaceStore,
};

/**
 * The different buttons that represent the modes in which an user can act upon the annotations.
 * It should filter the actions based on the access control list.
 */

@observer
class Actions extends Component<Props> {
  setModeCallback = (mode: $Values<typeof MODE>) => () => {
    const { uiStore: { setMode } } = this.props;
    setMode(mode);
  };

  render() {
    const { geoImageNetStore, uiStore: { selectedMode } } = this.props;
    const visibleMapModes = mapModes.filter((action) => geoImageNetStore.acl.can(
      action.permission_name,
      action.resource,
    ));

    const visibleReviewModes = reviewModes.filter((action) => geoImageNetStore.acl.can(
      action.permission_name,
      action.resource,
    ));

    return (
      <ActionsContainer>
        {
          visibleMapModes.map((action) => (
            <CustomTooltip title={`${action.tooltip}`} interactive enterDelay={600} key={`${action.mode}`}>
              <span style={{ textAlign: 'center', paddingLeft: '2px' }}>
                <FontAwesomeIcon
                  icon={action.icon}
                  className={action.mode === selectedMode ? 'fa-2x active' : 'fa-2x'}
                  onClick={this.setModeCallback(action.mode)}
                />
                <div style={{ paddingLeft: '4px' }}>{`${action.name}`}</div>
              </span>
            </CustomTooltip>
          ))
        }
        {
          visibleReviewModes.length > 0
            ? (
              <VerticalLine />
            ) : null
        }
        {
          visibleReviewModes.map((action) => (
            <CustomTooltip title={`${action.tooltip}`} interactive enterDelay={600} key={`${action.mode}`}>
              <span style={{ textAlign: 'center' }}>
                <FontAwesomeIcon
                  icon={action.icon}
                  className={action.mode === selectedMode ? 'fa-2x active' : 'fa-2x'}
                  onClick={this.setModeCallback(action.mode)}
                />
                <div style={{ paddingLeft: '4px' }}>{`${action.name}`}</div>
              </span>
            </CustomTooltip>
          ))
        }
      </ActionsContainer>
    );
  }
}
const component = withUserInterfaceStore(Actions);
export { component as Actions };
