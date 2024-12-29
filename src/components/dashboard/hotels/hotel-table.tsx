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
import dayjs from 'dayjs';

import type { SearchHotel, Hotel } from '@/types/hotel';
import { hotelApi } from '@/lib/hotel/hotel';
import { useSelection } from '@/hooks/use-selection';
import { ActionCell } from '@/components/common/action-cell';
import { HotelFilters } from './hotel-filters';

interface Location {
    id: string;
    name: string;
}

export function HotelTable(): React.JSX.Element {
    const [paginatedRows, setPaginatedRows] = useState<Hotel[]>([]);
    const [length, setLength] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [provinces, setProvinces] = useState<Location[]>([]);
    const [debouncedSearch, setDebouncedSearch] = useState<SearchHotel>({
        name: '',
        price: '',
        maxGroupSize: '',
    });
    const rowIds = useMemo(() => paginatedRows.map((user) => user._id), [paginatedRows]);
    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < paginatedRows.length;
    const selectedAll = paginatedRows.length > 0 && selected?.size === paginatedRows.length;

    const handleChange =
        (field: 'name' | 'price' | 'maxGroupSize') => (event: React.ChangeEvent<HTMLInputElement>) => {
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

    useEffect(() => {
        const fetchProvinces = async (): Promise<void> => {
            const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = (await response.json()) as { data: Location[] };
            setProvinces(data.data);
        };

        void fetchProvinces();
    }, []);

    const handleFindProvince = (id: string) => {
        const province = provinces.find((province) => province.id === id);
        return province?.name;
      }

    const handlePageChange = (_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setLimit(Number(event.target.value));
    };

    useEffect(() => {
        const fetchUsers = async (): Promise<void> => {
            const { data, total } = await hotelApi.searchHotels({
                page: 0,
                limit: 5,
                name: debouncedSearch.name,
                maxGroupSize: debouncedSearch.maxGroupSize,
                price: debouncedSearch.price,
                status: '',
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

    return (
        <Stack spacing={3}>
            <HotelFilters
                search={{
                    name: debouncedSearch.name || '',
                    maxGroupSize: debouncedSearch.maxGroupSize || '',
                    price: debouncedSearch.price || ''
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
                                <TableCell>Title</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>StartDate</TableCell>
                                <TableCell>End Date</TableCell>
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
                                                <Typography variant="subtitle2">{row.name}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{handleFindProvince(row.address?.province || '')}</TableCell>
                                        <TableCell>{dayjs(row.startDate).format('MMM D, YYYY')}</TableCell>
                                        <TableCell>{dayjs(row.endDate).format('MMM D, YYYY')}</TableCell>
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
