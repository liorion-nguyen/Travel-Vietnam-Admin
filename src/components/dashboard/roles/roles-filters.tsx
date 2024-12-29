'use client';

import React from 'react';
import { Card, Grid, MenuItem, TextField } from '@mui/material';

enum Status {
  ACTIVATED = 'ACTIVATED',
  INACTIVATED = 'INACTIVATED',
  REMOVED = 'REMOVED',
  NOTACTIVATED = 'NOT ACTIVATED',
}

interface CustomersFiltersProps {
  search: {
    name: string;
    status: string;
    [key: string]: string;
  };
  handleChange: (field: 'name' | 'status') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RolesFilters(props: CustomersFiltersProps): React.JSX.Element {
  const { search, handleChange } = props;
  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={search.title}
            onChange={handleChange('name')}
            fullWidth
            placeholder="Search by name"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField select label="Status" value={search.status} onChange={handleChange('status')} fullWidth>
            <MenuItem value="">None</MenuItem>
            {Object.values(Status).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Card>
  );
}
