// @flow strict
import React from 'react';
import {observer} from "mobx-react";
import {Chip, Tooltip, withStyles} from "@material-ui/core";
import {ANNOTATION_STATUS_AS_ARRAY} from "../../domain/constants";
import type {AnnotationStatusList, Counts} from "../../Types";

export const SpacedChip = withStyles({
    root: {
        marginLeft: '6px',
    },
})(Chip);

type Props = {
    name_en: string,
    counts: Counts,
    annotation_status_list: AnnotationStatusList,
};

@observer
class AnnotationCounts extends React.Component<Props> {
    render() {
        const {counts, name_en, annotation_status_list} = this.props;
        return (
            <>
                {ANNOTATION_STATUS_AS_ARRAY.map((status, i) => (
                    annotation_status_list[status].activated && counts[status]
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

export {AnnotationCounts};
