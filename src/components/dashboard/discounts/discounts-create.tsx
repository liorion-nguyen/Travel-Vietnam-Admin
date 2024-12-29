'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useFormik } from 'formik';

import { validationDiscount } from '@/lib/yub/index';
import { CreateDiscountRequestDto, DiscountType } from '@/types/discounts';
import { discountApi } from '@/lib/discount/discount';

export function CreateDiscount(): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const formik = useFormik<CreateDiscountRequestDto>({
    initialValues: {
      code: '',
      description: '',
      value: 0,
      startDate: '',
      endDate: '',
      type: DiscountType.TOUR,
      min_order_value: 0,
      max_discount_value: 0,
    },
    validationSchema: validationDiscount,
    onSubmit: async (values) => {
      await discountApi.createDiscount(values);
      handleCloseDialog();
    },
  });

  const handleAddClick = (): void => {
    setDialogOpen(true);
    setVisible(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
    formik.resetForm();
  };

  return (
    <>
      <Button variant="outlined" startIcon={<PlusIcon />} onClick={handleAddClick}>
        Create New Discount
      </Button>

      <Dialog
        sx={{
          '& .MuiDialog-container.MuiDialog-scrollPaper.mui-hz1bth-MuiDialog-container > div': {
            maxWidth: 800,
            visibility: visible ? 'visible' : 'hidden',
          },
        }}
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
      >
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <DialogTitle>
            <Typography variant="h3" textAlign="center" sx={{ fontWeight: 'bold' }}>
              Create New Discount
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Discount Code"
                      variant="outlined"
                      fullWidth
                      name="code"
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      error={formik.touched.code ? Boolean(formik.errors.code) : undefined}
                      helperText={formik.touched.code ? formik.errors.code : null}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={formik.touched.description ? Boolean(formik.errors.description) : undefined}
                      helperText={formik.touched.description ? formik.errors.description : null}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <TextField
                      label="Value"
                      type="number"
                      variant="outlined"
                      fullWidth
                      name="value"
                      value={formik.values.value}
                      onChange={formik.handleChange}
                      error={formik.touched.value ? Boolean(formik.errors.value) : undefined}
                      helperText={formik.touched.value ? formik.errors.value : null}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Type"
                    variant="outlined"
                    fullWidth
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type ? Boolean(formik.errors.type) : undefined}
                    helperText={formik.touched.type ? formik.errors.type : null}
                  >
                    {Object.values(DiscountType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Min Order Value"
                    type="number"
                    variant="outlined"
                    fullWidth
                    name="min_order_value"
                    value={formik.values.min_order_value}
                    onChange={formik.handleChange}
                    error={formik.touched.min_order_value ? Boolean(formik.errors.min_order_value) : undefined}
                    helperText={formik.touched.min_order_value ? formik.errors.min_order_value : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Max Discount Value"
                    type="number"
                    variant="outlined"
                    fullWidth
                    name="max_discount_value"
                    value={formik.values.max_discount_value}
                    onChange={formik.handleChange}
                    error={formik.touched.max_discount_value ? Boolean(formik.errors.max_discount_value) : undefined}
                    helperText={formik.touched.max_discount_value ? formik.errors.max_discount_value : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    name="startDate"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    error={formik.touched.startDate ? Boolean(formik.errors.startDate) : undefined}
                    helperText={formik.touched.startDate ? formik.errors.startDate : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    name="endDate"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    error={formik.touched.endDate ? Boolean(formik.errors.endDate) : undefined}
                    helperText={formik.touched.endDate ? formik.errors.endDate : null}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="space-around">
              <Button
                type="submit"
                variant="contained"
                sx={{ marginTop: 2 }}
              >
                Create Discount
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
