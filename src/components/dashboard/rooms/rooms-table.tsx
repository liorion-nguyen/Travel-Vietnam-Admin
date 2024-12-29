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
import { RoomFilters } from './rooms-filters';
import { Room, SearchRoom } from '@/types/rooms';
import { roomApi } from '@/lib/room/room';

export function RoomTable(): React.JSX.Element {
    const [paginatedRows, setPaginatedRows] = useState<Room[]>([]);
    const [length, setLength] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [debouncedSearch, setDebouncedSearch] = useState<SearchRoom>({
        roomNumber: 0,
        roomType: '',
        price: 0,
    });
    const rowIds = useMemo(() => paginatedRows.map((user) => user._id), [paginatedRows]);
    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < paginatedRows.length;
    const selectedAll = paginatedRows.length > 0 && selected?.size === paginatedRows.length;

    const handleChange =
        (field: 'roomNumber' | 'roomType' | 'price') => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        const fetchRooms = async (): Promise<void> => {
            const { data, total } = await roomApi.searchRooms({
                page: 0,
                limit: 5,
                roomNumber: debouncedSearch.roomNumber || undefined,
                roomType: debouncedSearch.roomType || undefined,
                price: debouncedSearch.price || undefined,
            });
            setPaginatedRows(data ?? []);
            setLength(total ?? 0);
        };
        const timer = setTimeout(() => {
            void fetchRooms();
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [page, limit, debouncedSearch]);

    return (
        <Stack spacing={3}>
            <RoomFilters
                search={{
                    roomNumber: debouncedSearch.roomNumber || 0,
                    roomType: debouncedSearch.roomType || '',
                    price: debouncedSearch.price || 0,
                }}
                handleChange={handleChange}
            />
            <Card>
                <Box sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: '800px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selectedAll} indeterminate={selectedSome} onChange={handleSelectAll} />
                                </TableCell>
                                <TableCell>Hotel Name</TableCell>
                                <TableCell>Room Number</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Room Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell />
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
                                                <Typography variant="subtitle2">{row.hotelName}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{row.roomNumber}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{row.roomType}</TableCell>
                                        <TableCell>{row.status ? 'Active' : 'Inactive'}</TableCell>
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
