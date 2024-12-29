'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';

import { validationDiscount } from '@/lib/yub/index';
import { CreateDiscountRequestDto, DiscountType } from '@/types/discounts';
import { discountApi } from '@/lib/discount/discount';

interface DiscountViewProps {
  open: boolean;
  onClose: () => void;
  discountId: string;
}

export function DiscountView(props: DiscountViewProps): React.ReactElement {
  const { open, onClose, discountId } = props;

  const formik = useFormik<CreateDiscountRequestDto>({
    initialValues: {
      code: '',
      description: '',
      value: 0,
      type: DiscountType.TOUR,
      startDate: '',
      endDate: '',
      min_order_value: 0,
      max_discount_value: 0,
    },
    validationSchema: validationDiscount,
    onSubmit: async (values) => {
      await discountApi.updateDiscount(values, discountId);
      formik.resetForm();
      onClose();
    },
  });

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await discountApi.getDiscount(discountId);
      if (response.data) {
        void formik.setValues({
          code: response.data.code ?? '',
          description: response.data.description ?? '',
          type: response.data.type ?? DiscountType.TOUR,
          value: response.data.value ?? 0,
          min_order_value: response.data.min_order_value ?? 0,
          max_discount_value: response.data.max_discount_value ?? 0,
          startDate: response.data.startDate ? new Date(response.data.startDate).toISOString().split('T')[0] : '',
          endDate: response.data.endDate ? new Date(response.data.endDate).toISOString().split('T')[0] : '',
        });
      }
    }
    if (open) {
      void fetchData();
    }
  }, [open, discountId, formik]);

  // const handleClickOpen = async (): Promise<void> => {
  //   const response = await hotelApi.searchHotels({
  //     name: formik.values.name,
  //     price: formik.values.price.toString(),
  //   });
  //   setHotels(response.data || []);
  //   setOpenHotel(true);
  //   setVisible(false);
  // };

  return (
    <>
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
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <DialogTitle>
            <Typography variant="h3" textAlign="center" sx={{ fontWeight: 'bold' }}>
              View Discount
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Code"
                      variant="outlined"
                      fullWidth
                      name="code"
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      error={formik.touched.code ? Boolean(formik.errors.code) : undefined}
                      helperText={formik.touched.code ? formik.errors.code : null}
                      disabled
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
                      disabled
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
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Type"
                    variant="outlined"
                    fullWidth
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type ? Boolean(formik.errors.type) : undefined}
                    helperText={formik.touched.type ? formik.errors.type : null}
                    disabled
                  />
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
                    disabled
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
                    disabled
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
                    value={formik.values.startDate ? new Date(formik.values.startDate).toISOString().split('T')[0] : ''}
                    onChange={formik.handleChange}
                    error={formik.touched.startDate ? Boolean(formik.errors.startDate) : undefined}
                    helperText={formik.touched.startDate ? formik.errors.startDate : null}
                    disabled
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
                    value={formik.values.endDate ? new Date(formik.values.endDate)?.toISOString().split('T')[0] : ''}
                    onChange={formik.handleChange}
                    error={formik.touched.endDate ? Boolean(formik.errors.endDate) : undefined}
                    helperText={formik.touched.endDate ? formik.errors.endDate : null}
                    disabled
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="flex-end" px={3}>
              <Button onClick={onClose} variant="contained" sx={{ marginTop: 2 }}>
                Close
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
