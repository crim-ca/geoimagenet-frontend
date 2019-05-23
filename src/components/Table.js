import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    withStyles
} from '@material-ui/core';

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

class EnhancedTableHead extends React.Component {
    static propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
        columns: PropTypes.array.isRequired,
    };

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {order, orderBy, columns} = this.props;

        return (
            <TableHead>
                <TableRow>
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
        data: PropTypes.array,
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
        const {data} = this.props;
        const {order, orderBy, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        const columns = [];
        if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
                columns.push({
                    id: key,
                    label: key,
                    numeric: !Number.isNaN(data[0][key]),
                    disablePadding: false
                });
            });
        }
        return (
            <React.Fragment>
                <div className={classes.tableWrapper}>
                    <Table aria-labelledby='tableTitle'>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            columns={columns}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, row_index) => {
                                    return (
                                        <TableRow key={row_index}>
                                            {Object.keys(row).map((key, key_index) => (
                                                <TableCell key={key_index}>{row[key]}</TableCell>
                                            ))}
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
                    count={data.length}
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
