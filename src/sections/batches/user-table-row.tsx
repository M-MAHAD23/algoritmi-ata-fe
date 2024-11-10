import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { deleteBatch } from 'src/hooks/useAPIS';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  batchNumber: string;
  batchSession: string;
  batchName: string;
  status: string;
  isEnable: boolean;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, setData , handleEditBatch}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent row click event
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleRowClick = () => {
    navigate('/batch-detail');
  };

  const handleDeleteBatch = async () => {
    try {
      const res = await deleteBatch(row._id);
      setData(res.data);
      // navigate('/batches');
    } catch (error) {
      console.error('Error deleting batch:', error);
    } finally {
      handleClosePopover();
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleRowClick}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.batchNumber}
          </Box>
        </TableCell>

        <TableCell>{row.batchSession}</TableCell>

        <TableCell>{row.batchName ? row.batchName : ''}</TableCell>

        <TableCell>
          <Label color={(row.status === 'banned' && 'error') || 'success'}>
            {row.isEnable ? 'Enabled' : 'Disabled'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={()=>{handleEditBatch(row)}}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteBatch} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
