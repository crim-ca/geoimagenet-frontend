import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import {Tooltip} from '@material-ui/core';

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
    {id: 'id', numeric: true, disablePadding: false, label: 'Id'},
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



const EnhancedTableToolbar = withStyles(theme => {
    const {values} = theme;
    return {
        title: {
            textAlign: 'center',
        },
    };
})(props => {
    const {classes, children} = props;
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

    handleSelectAllClick = event => {

        if (event.target.checked) {
            const {datasets} = this.props.state_proxy;
            this.setState(() => ({selected: datasets.map(n => n.id)}));
            return;
        }

        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {classes} = this.props;
        const {items} = this.props.state_proxy.datasets;
        const {order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

        return (
            <React.Fragment>
                <EnhancedTableToolbar numSelected={selected.length} />
                <div className={classes.tableWrapper}>
                    <Table aria-labelledby='tableTitle'>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={items.length}
                        />
                        <TableBody>
                            {stableSort(items, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(dataset => {
                                    const isSelected = this.isSelected(dataset.id);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, dataset.id)}
                                            role='checkbox'
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={dataset.id}
                                            selected={isSelected}>
                                            <TableCell padding='checkbox'>
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell align='right'>{dataset.id}</TableCell>
                                            <TableCell component='th' scope='row' padding='none'>
                                                {dataset.created}
                                            </TableCell>
                                            <TableCell align='right'>{dataset.classes}</TableCell>
                                            <TableCell align='right'>{dataset.annotations}</TableCell>
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
                    count={items.length}
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

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    state_proxy: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
