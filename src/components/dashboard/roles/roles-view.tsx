'use client';

import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Status } from '@/types/roles';
import type { Permission, Roles } from '@/types/roles';
import { rolesApi } from '@/lib/roles/roles';

interface TourViewProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- This is a false positive
  roleId: unknown | string;
}
export function ViewRoles(props: TourViewProps): React.ReactElement {
  const { open, onClose, roleId } = props;
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role, setRole] = useState<Roles>();

  useEffect(() => {
    const fetchRole = async (): Promise<void> => {
      const { data } = await rolesApi.getRoles(roleId as string);
      if (data) {
        setRole(data ?? []);
      }
    };

    const fetchPermissions = async (): Promise<void> => {
      const { data } = await rolesApi.getPermissions();
      if (data) {
        setPermissions(data ?? []);
      }
    };

    if (open) {
      void fetchRole();
      void fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This is a false positive
  }, [open]);

  return role ? (
    <Dialog
      sx={{
        '& .MuiDialog-container.MuiDialog-scrollPaper.mui-hz1bth-MuiDialog-container > div': {
          maxWidth: 800,
        },
      }}
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 'bold' }}>
          View Role
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ marginY: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Role Name" variant="outlined" fullWidth name="name" value={role?.name} disabled />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                disabled
                name="description"
                multiline
                rows={3}
                value={role?.description}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Autocomplete
                  multiple
                  disabled
                  options={permissions || []}
                  getOptionLabel={(option) => option.name}
                  value={permissions.filter((p) => role?.permissions.includes(p.id))}
                  renderInput={(params) => (
                    <TextField {...params} label="Permissions" placeholder="Select permissions" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
                    ))
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField select label="Status" variant="outlined" fullWidth disabled name="status" value={role?.status}>
                <MenuItem value="">None</MenuItem>
                {Object.values(Status).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Create At"
                variant="outlined"
                fullWidth
                name="createAt"
                value={role?.createdAt}
                disabled
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" width="100%" justifyContent="flex-end">
          <Button onClick={onClose} variant="contained" sx={{ marginTop: 2 }}>
            Close
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  ) : (
    <Grid />
  );
}
