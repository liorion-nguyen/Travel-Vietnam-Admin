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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useFormik } from 'formik';

import { Status } from '@/types/roles';
import type { CreateRoleForm, Permission } from '@/types/roles';
import { rolesApi } from '@/lib/roles/roles';
import { validationRoles } from '@/lib/yub';

export function CreateRoles(): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const formik = useFormik<CreateRoleForm>({
    initialValues: {
      name: '',
      description: '',
      permissions: [],
      status: null,
    },
    validationSchema: validationRoles,
    onSubmit: async (values) => {
      await rolesApi.createRoles(values);
      handleCloseDialog();
    },
  });

  useEffect(() => {
    const fetchPermissions = async (): Promise<void> => {
      const { data } = await rolesApi.getPermissions();
      if (data) {
        setPermissions(data ?? []);
      }
    };

    if (dialogOpen) {
      void fetchPermissions();
    }
  }, [dialogOpen]);

  const handleAddClick = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
    formik.resetForm();
  };

  return (
    <>
      <Button variant="outlined" startIcon={<PlusIcon />} onClick={handleAddClick}>
        Create New Tour
      </Button>

      <Dialog
        sx={{
          '& .MuiDialog-container.MuiDialog-scrollPaper.mui-hz1bth-MuiDialog-container > div': {
            maxWidth: 800,
          },
        }}
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
      >
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <DialogTitle>
            <Typography variant="h3" textAlign="center" sx={{ fontWeight: 'bold' }}>
              Create Role
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Role Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name ? Boolean(formik.errors.name) : undefined}
                    helperText={formik.touched.name ? formik.errors.name : null}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    name="description"
                    multiline
                    rows={3}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description ? Boolean(formik.errors.description) : undefined}
                    helperText={formik.touched.description ? formik.errors.description : null}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <Autocomplete
                      multiple
                      options={permissions}
                      getOptionLabel={(option) => option.name}
                      value={permissions.filter((p) => formik.values.permissions.includes(p.id))}
                      onChange={(event, newValue) => {
                        const selectedPermissions = newValue.map((permission) => permission.id);
                        void formik.setFieldValue('permissions', selectedPermissions);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Permissions"
                          placeholder="Select permissions"
                          error={formik.touched.permissions ? Boolean(formik.errors.permissions) : undefined}
                          helperText={formik.touched.permissions ? formik.errors.permissions : null}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip label={option.code} {...getTagProps({ index })} key={option.id} />
                        ))
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    label="Status"
                    variant="outlined"
                    fullWidth
                    name="status"
                    value={formik.values.status || ''}
                    onChange={formik.handleChange}
                    error={formik.touched.status ? Boolean(formik.errors.status) : undefined}
                    helperText={formik.touched.status ? formik.errors.status : null}
                  >
                    <MenuItem value="">None</MenuItem>
                    {Object.values(Status).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="space-around">
              <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
                Create
              </Button>
              <Button onClick={handleCloseDialog} variant="contained" sx={{ marginTop: 2 }}>
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
