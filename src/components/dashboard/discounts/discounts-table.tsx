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

import { useSelection } from '@/hooks/use-selection';
import { ActionCell } from '@/components/common/action-cell';
import { DiscountFilters } from './discounts-filters';
import { Discount, SearchDiscount } from '@/types/discounts';
import { discountApi } from '@/lib/discount/discount';

export function DiscountTable(): React.JSX.Element {
    const [paginatedRows, setPaginatedRows] = useState<Discount[]>([]);
    const [length, setLength] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [debouncedSearch, setDebouncedSearch] = useState<SearchDiscount>({
        code: '',
        type: '',
        value: 0,
    });
    const rowIds = useMemo(() => paginatedRows.map((user) => user._id), [paginatedRows]);
    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < paginatedRows.length;
    const selectedAll = paginatedRows.length > 0 && selected?.size === paginatedRows.length;

    const handleChange =
        (field: 'code' | 'type' | 'value') => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        const fetchDiscounts = async (): Promise<void> => {
            const { data, total } = await discountApi.searchDiscounts({
                page: 0,
                limit: 5,
                code: debouncedSearch.code,
                type: debouncedSearch.type || undefined,
                value: debouncedSearch.value || 0,
            });
            setPaginatedRows(data ?? []);
            setLength(total ?? 0);
        };
        const timer = setTimeout(() => {
            void fetchDiscounts();
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [page, limit, debouncedSearch]);

    return (
        <Stack spacing={3}>
            <DiscountFilters
                search={{
                    code: debouncedSearch.code || '',
                    type: debouncedSearch.type || undefined,
                    value: debouncedSearch.value || 0,
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
                                <TableCell>Code</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>StartDate</TableCell>
                                <TableCell>End Date</TableCell>
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
                                                <Typography variant="subtitle2">{row.code}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{row.value}</TableCell>
                                        <TableCell>{row.type}</TableCell>
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
