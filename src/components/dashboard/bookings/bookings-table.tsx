'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useSelection } from '@/hooks/use-selection';
import { ActionCell } from '@/components/common/action-cell';

import { BookingFilters } from './bookings-filters';
import { BookingStatus, type Booking } from '@/types/booking';
import { bookingApi } from '@/lib/booking/booking';
import { Chip } from '@mui/material';

export function BookingTable(): React.JSX.Element {
  const [paginatedRows, setPaginatedRows] = useState<Booking[]>([]);
  const [length, setLength] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [debouncedSearch, setDebouncedSearch] = useState({
    amount: '',
    status: '',
    bookingType: '',
  });
  const rowIds = useMemo(() => paginatedRows.map((user) => user._id), [paginatedRows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < paginatedRows.length;
  const selectedAll = paginatedRows.length > 0 && selected?.size === paginatedRows.length;

  const handleChange =
    (field: 'amount' | 'status' | 'bookingType') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setDebouncedSearch((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll]
  );

  const handleSelectOne = useCallback(
    (userId: string, event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        selectOne(userId);
      } else {
        deselectOne(userId);
      }
    },
    [selectOne, deselectOne]
  );

  const handlePageChange = (_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setLimit(Number(event.target.value));
  };

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      const { data, total } = await bookingApi.searchBookings({
        page,
        limit,
        amount: debouncedSearch.amount,
        status: debouncedSearch.status,
        bookingType: debouncedSearch.bookingType,
      });
      setPaginatedRows(data ?? []);
      setLength(total ?? 0);
    };
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [page, limit, debouncedSearch]);

  const getStatusChip = (status: BookingStatus): React.ReactNode => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Chip label={BookingStatus.CONFIRMED} color="success" />;
      case BookingStatus.PENDING:
        return <Chip label={BookingStatus.PENDING} color="warning" />;
      case BookingStatus.CANCELLED:
        return <Chip label={BookingStatus.CANCELLED} color="error" />;
      default:
        return <Chip label={status} />;
    }
  };
  return (
    <Stack spacing={3}>
      <BookingFilters search={debouncedSearch} handleChange={handleChange} />
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedAll} indeterminate={selectedSome} onChange={handleSelectAll} />
                </TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Booking Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => {
                const isSelected = selected?.has(row._id);

                return (
                  <TableRow hover key={row._id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          handleSelectOne(row._id || '', event);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Typography variant="subtitle2">{row.orderId}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.amount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    <TableCell>{row.bookingType}</TableCell>
                    <TableCell>
                      <ActionCell data={row} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={length || 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Stack>
  );
}
