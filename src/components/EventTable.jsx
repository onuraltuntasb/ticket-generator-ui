import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { AddCircleOutlined, Edit } from '@mui/icons-material';
import { useState } from 'react';
import ModalBase from './ModalBase';
import { useAppDispatch } from 'redux/hooks';

import { sendSelectedEventData } from 'redux/features/eventSlice';
import AddUpdateEventForm from './form/AddUpdateEventForm';
import DeleteEventForm from './form/DeleteEventForm';
import { useEffect } from 'react';

//TODO add useMemo hook later for table data

function createData(id, name, startDate, endDate, ticketSellingStartDate, status) {
    return {
        id,
        name,
        startDate,
        endDate,
        ticketSellingStartDate,
        status
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'startDate',
        numeric: false,
        disablePadding: false,
        label: 'Start Date'
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        label: 'End Date'
    },
    {
        id: 'ticketSellingStartDate',
        numeric: false,
        disablePadding: false,
        label: 'Ticket Selling Start Date'
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status'
    }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell?.id, headCell?.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

function EnhancedTableToolbar(props) {
    const { numSelected, disableOperationsHead, setSelected } = props;

    const [isOpen, setisOpen] = useState(false);
    const [operationType, setoperationType] = useState(null);

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Events
                </Typography>
            )}

            {disableOperationsHead ? null : (
                <>
                    <Tooltip title="Add Event">
                        <IconButton
                            onClick={() => {
                                setisOpen(true);
                                setoperationType('add');
                            }}
                        >
                            <AddCircleOutlined />
                        </IconButton>
                    </Tooltip>

                    {numSelected === 1 ? (
                        <Tooltip title="update">
                            <IconButton
                                onClick={() => {
                                    setisOpen(true);
                                    setoperationType('edit');
                                }}
                            >
                                <Edit />
                            </IconButton>
                        </Tooltip>
                    ) : null}

                    {numSelected === 1 ? (
                        <Tooltip title="Delete">
                            <IconButton
                                onClick={() => {
                                    setisOpen(true);
                                    setoperationType('delete');
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </>
            )}

            <ModalBase
                modalTop={operationType === 'delete' ? '20%' : '50%'}
                isOpen={isOpen}
                setIsOpen={setisOpen}
                childComp={
                    operationType !== 'delete' ? (
                        <AddUpdateEventForm
                            setSelectedProp={setSelected}
                            setIsOpen={setisOpen}
                            operationType={operationType}
                        />
                    ) : (
                        <DeleteEventForm setSelected={setSelected} setIsOpen={setisOpen} />
                    )
                }
            />
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

export default function EventTable(props) {
    const dispatch = useAppDispatch();

    const { eventList: eventListData, disableOperations } = props;

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('startDate');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setrows] = useState([]);

    useEffect(() => {
        setSelected([]);
        dispatch(sendSelectedEventData(null));
    }, []);

    useEffect(() => {
        if (eventListData) {
            var temp = [];
            eventListData
                //.filter((el) => el?.status != false)
                .forEach((el) => {
                    temp.push(
                        createData(
                            el.id.toString(),
                            el.name,
                            new Date(el.startDate).toLocaleString(),
                            new Date(el.endDate).toLocaleString(),
                            new Date(el.ticketSellingStartDate).toLocaleString(),
                            el.status.toString()
                        )
                    );
                });

            setrows([...temp]);
        }
    }, [eventListData]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        //console.log(id);

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        var selectedEvent = {};

        if (newSelected.length === 1) {
            selectedEvent = eventListData?.filter((el) => el.id.toString() === id);
        }
        //console.log(selectedEvent);

        dispatch(sendSelectedEventData(selectedEvent));

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }} elevation={1}>
                <EnhancedTableToolbar
                    disableOperationsHead={disableOperations}
                    numSelected={selected.length}
                    setSelected={setSelected}
                    selected={selected}
                />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows ? (
                                visibleRows.length > 0 ? (
                                    visibleRows.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.startDate}</TableCell>
                                                <TableCell align="left">{row.endDate}</TableCell>
                                                <TableCell align="left">{row.ticketSellingStartDate}</TableCell>
                                                <TableCell align="left">{row.status?.toString()}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow hover role="checkbox" tabIndex={-1} sx={{ cursor: 'pointer' }}>
                                        <TableCell padding="checkbox">
                                            <Checkbox color="primary" />
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            'There is no event.'
                                        </TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                )
                            ) : (
                                'There is no event.'
                            )}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />

            <br />
            {/*   {selected ? (selected.length > 0 ? JSON.stringify(selected) : 'selected.length') : 'selected'} */}
            <br />
        </Box>
    );
}
