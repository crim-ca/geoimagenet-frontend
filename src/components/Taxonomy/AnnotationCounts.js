// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import { Chip, Tooltip, withStyles } from '@material-ui/core';
import { ANNOTATION_STATUS_AS_ARRAY } from '../../constants';
import type { AnnotationStatusFilters, Counts } from '../../Types';

export const SpacedChip = withStyles({
  root: {
    marginLeft: '6px',
  },
})(Chip);

type Props = {
  name_en: string,
  counts: Counts,
  annotationStatusFilters: AnnotationStatusFilters,
};

@observer
class AnnotationCounts extends React.Component<Props> {
  render() {
    const { counts, name_en, annotationStatusFilters } = this.props;
    return (
      <>
        {ANNOTATION_STATUS_AS_ARRAY.map((status, i) => (
          annotationStatusFilters[status].activated && counts[status]
            ? (
              <Tooltip key={i} title={`${counts[status]} ${status} annotations of class ${name_en}`}>
                <SpacedChip label={counts[status]}
                            className={`annotation_${status}`}
                            variant='outlined' />
              </Tooltip>
            ) : null
        ))}
      </>
    );
  }
}

export { AnnotationCounts };
