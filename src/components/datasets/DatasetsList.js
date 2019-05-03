import React from 'react';
import PropTypes from 'prop-types';
import {
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography,
    Tooltip,
    withStyles
} from '@material-ui/core';
import {StoreActions} from '../../store';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === SORT.DESCENDING ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const columns = [
    {id: 'name', numeric: true, disablePadding: false, label: 'Name'},
    {id: 'created', numeric: false, disablePadding: true, label: 'Created'},
    {id: 'classes', numeric: true, disablePadding: false, label: 'Classes'},
    {id: 'annotations', numeric: true, disablePadding: false, label: 'Annotations'},
];

class EnhancedTableHead extends React.Component {
    static propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
    };

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {order, orderBy} = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding='checkbox' />
                    {columns.map(
                        column => (
                            <TableCell
                                key={column.id}
                                align={column.numeric ? 'right' : 'left'}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === column.id ? order : false}>
                                <Tooltip
                                    title='Sort'
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}>
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.createSortHandler(column.id)}>
                                        {column.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}


const EnhancedTableToolbar = withStyles({
    title: {
        textAlign: 'center',
    },
})(props => {
    const {classes} = props;
    return <Typography className={classes.title} variant='h6' id='tableTitle'>Available datasets</Typography>;
});

const SORT = {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
};

const styles = () => ({
    tableWrapper: {
        overflowX: 'auto',
    },
});

class EnhancedTable extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        state_proxy: PropTypes.object.isRequired,
        store_actions: PropTypes.instanceOf(StoreActions).isRequired,
        datasets: PropTypes.array,
    };

    state = {
        order: SORT.DESCENDING,
        orderBy: 'created',
        selected: [],
        page: 0,
        rowsPerPage: 5,
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = SORT.DESCENDING;

        if (this.state.orderBy === property && this.state.order === SORT.DESCENDING) {
            order = SORT.ASCENDING;
        }

        this.setState({order, orderBy});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    render() {
        const {classes} = this.props;
        const {datasets} = this.props;
        const {order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, datasets.length - page * rowsPerPage);

        return (
            <React.Fragment>
                <EnhancedTableToolbar numSelected={selected.length} />
                <div className={classes.tableWrapper}>
                    <Table aria-labelledby='tableTitle'>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={datasets.length}
                        />
                        <TableBody>
                            {stableSort(datasets, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(dataset => {
                                    return (
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            key={dataset.id}>
                                            <TableCell padding='checkbox'>
                                                <Link
                                                    href={`${ML_ENDPOINT}/datasets/${dataset.id}/download`}
                                                    target='_blank'>Download</Link>
                                            </TableCell>
                                            <TableCell align='right'>{dataset.name}</TableCell>
                                            <TableCell component='th' scope='row' padding='none'>
                                                {dataset.created}
                                            </TableCell>
                                            <TableCell align='right'>{dataset.classes_count}</TableCell>
                                            <TableCell align='right'>{dataset.annotations_count}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 49 * emptyRows}}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={datasets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(EnhancedTable);
