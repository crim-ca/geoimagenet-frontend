import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles, Paper, Select, MenuItem, Divider, TextField, Button} from '@material-ui/core';
import {observer} from 'mobx-react';

const DatasetLayout = withStyles({
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr minmax(300px, max-content) 1fr',
    },
    children: {
        gridColumn: '2/3',
    }
})(props => {
    const {classes, children} = props;
    return <div className={classes.grid}>
        <div className={classes.children}>{children}</div>
    </div>;
});

const DatasetsPaper = withStyles(theme => ({
    root: {
        padding: theme.values.gutterSmall,
        gridGap: theme.values.gutterSmall,
        display: 'grid',
        gridTemplateRows: 'max-content',

    }
}))(Paper);

@observer
class Datasets extends Component {

    static propTypes = {
        datasets: PropTypes.array.isRequired
    };

    state = {
        selected_dataset: null,
        applicant_email: '',
        applicant_name: '',
    };

    handle_select_change = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handle_field_change = name => event => {
        this.setState({[name]: event.target.value});
    };

    render() {
        return (
            <DatasetLayout>
                <DatasetsPaper>
                    <Select value={this.state.selected_dataset}
                            onChange={this.handle_select_change}>
                        {this.props.datasets.map((dataset, i) => <MenuItem key={i}
                                                                           value={dataset}>{dataset.title}</MenuItem>)}
                    </Select>
                    <Divider />
                    <TextField label='Email Address'
                               value={this.state.applicant_email}
                               onChange={this.handle_field_change('applicant_email')} />
                    <TextField label='Name'
                               value={this.state.applicant_name}
                               onChange={this.handle_field_change('applicant_name')} />
                    <Button variant='contained' color='primary'>Download</Button>
                </DatasetsPaper>
            </DatasetLayout>
        );
    }
}

export {Datasets};
