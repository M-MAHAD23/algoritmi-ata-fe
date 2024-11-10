import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useTable } from 'src/sections/user/view';
import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { getBatches, postBatch, editBatch } from 'src/hooks/useAPIS';
import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function BatchView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');
  const [batchSession, setBatchSession] = useState('');
  const [batchName, setBatchName] = useState('');
  const [editData, setEditData] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const newBatch = {
    batchNumber,
    batchSession,
    batchName,
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBatches();
      setData(data?.data);
    };
    fetchData();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleEditBatch = (data) => {
    setEditData(data);
    setEditMode(true);
    handleOpenModal();
    setBatchNumber(data.batchNumber);
    setBatchSession(data.batchSession);
    setBatchName(data.batchName);
  };

  const handleCreateBatch = async () => {
    console.log(newBatch); // Log the batch details to the console
    // Optionally, add this new batch to your data state
    setData([
      ...data,
      { ...newBatch, id: Date.now().toString(), status: 'Active', isEnable: true },
    ]);
    const res = await postBatch(newBatch);
    setData(res.data);
    // Clear form inputs and close modal
    setBatchNumber('');
    setBatchSession('');
    setBatchName('');
    handleCloseModal();
  };
  const handleEdit = async () => {
    const res = await editBatch({ ...newBatch, id: editData._id });
    setData(res.data);
    setEditMode(false);
    handleCloseModal();
  };

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          All Batches
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenModal}
        >
          New Batch
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'Name', label: 'Batch No' },
                  { id: 'company', label: 'Batch Session' },
                  { id: 'role', label: 'Batch Name' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {data
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      setData={setData}
                      handleEditBatch={handleEditBatch}
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* New Batch Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>New Batch</DialogTitle>
        <DialogContent>
          <TextField
            label="Batch Number"
            fullWidth
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Batch Session"
            fullWidth
            value={batchSession}
            onChange={(e) => setBatchSession(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Batch Name"
            fullWidth
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancel
          </Button>
          {editMode ? (
            <Button onClick={handleEdit} variant="contained">
              Edit
            </Button>
          ) : (
            <Button onClick={handleCreateBatch} variant="contained">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
