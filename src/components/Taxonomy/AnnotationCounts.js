// @flow
import React from 'react';
import {observer} from "mobx-react";
import {Chip, Tooltip, withStyles} from "@material-ui/core";
import {ANNOTATION_STATUS_AS_ARRAY} from "../../domain/constants";
import {typeof GeoImageNetStore} from "../../store/GeoImageNetStore";

export const SpacedChip = withStyles({
    root: {
        marginLeft: '6px',
    },
})(Chip);

type Props = {
    name_en: string,
    counts: Counts,
    state_proxy: GeoImageNetStore
};

@observer
class AnnotationCounts extends React.Component<Props> {
    render() {
        const {counts, name_en, state_proxy: {annotation_status_list}} = this.props;
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
