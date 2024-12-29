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
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useFormik } from 'formik';

import { type Hotel } from '@/types/hotel';
import { type CreateTourForm } from '@/types/tour';
import { hotelApi } from '@/lib/hotel/hotel';
import { tourApi } from '@/lib/tour/tour';
import { validationTour } from '@/lib/yub/index';

import { AddressForm } from './common/address-form';
import { HotelSliderDialog } from './common/hotel-slider-dialog';
import { ImageUpload } from './common/image-upload';

export function CreateTour(): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(false);
  const formik = useFormik<CreateTourForm>({
    initialValues: {
      files: [],
      title: '',
      desc: '',
      price: 0,
      maxGroupSize: 1,
      hotelId: '',
      startDate: '',
      endDate: '',
      destination: { province: '', district: '', ward: '' },
      departurePoint: { province: '', district: '', ward: '' },
    },
    validationSchema: validationTour,
    onSubmit: async (values) => {
      await tourApi.createTour(values);
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

  const handleCloseDialogTour = (): void => {
    setVisible(false);
  };

  const handleClickOpen = async (): Promise<void> => {
    const response = await hotelApi.searchHotels({ limit: 10, page });
    setHotels(response.data || []);
    setOpen(true);
    handleCloseDialogTour();
  };

  const handleClose = (): void => {
    setOpen(false);
    handleAddClick();
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
              Create Tour
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ImageUpload
                    images={formik.values.files as string[]}
                    setImages={(newImages) => formik.setFieldValue('files', newImages)}
                    error={formik.touched.files && formik.errors.files ? formik.errors.files[0] : undefined}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Tour Title"
                      variant="outlined"
                      fullWidth
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={formik.touched.title ? Boolean(formik.errors.title) : undefined}
                      helperText={formik.touched.title ? formik.errors.title : null}
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
                      name="desc"
                      value={formik.values.desc}
                      onChange={formik.handleChange}
                      error={formik.touched.desc ? Boolean(formik.errors.desc) : undefined}
                      helperText={formik.touched.desc ? formik.errors.desc : null}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box>
                    <TextField
                      label="Price"
                      type="number"
                      variant="outlined"
                      fullWidth
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={formik.touched.price ? Boolean(formik.errors.price) : undefined}
                      helperText={formik.touched.price ? formik.errors.price : null}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <TextField
                      label="Max Group Size"
                      type="number"
                      variant="outlined"
                      fullWidth
                      name="maxGroupSize"
                      value={formik.values.maxGroupSize}
                      onChange={formik.handleChange}
                      error={formik.touched.maxGroupSize ? Boolean(formik.errors.maxGroupSize) : undefined}
                      helperText={formik.touched.maxGroupSize ? formik.errors.maxGroupSize : null}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button fullWidth sx={{ height: '100%' }} variant="contained" onClick={handleClickOpen}>
                    Select Hotel
                  </Button>
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
                <AddressForm
                  addressType="destination"
                  address={formik.values.destination}
                  setAddress={(newAddress) => formik.setFieldValue('destination', newAddress)}
                  formik={formik}
                />
                <AddressForm
                  addressType="departurePoint"
                  address={formik.values.departurePoint}
                  setAddress={(newAddress) => formik.setFieldValue('departurePoint', newAddress)}
                  formik={formik}
                />
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="space-around">
              <Button
                type="submit"
                variant="contained"
                sx={{ marginTop: 2 }}
                onSubmit={() => {
                  formik.handleSubmit();
                }}
              >
                Create Tour
              </Button>
              <Button onClick={handleCloseDialog} variant="contained" sx={{ marginTop: 2 }}>
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        sx={{
          '& .MuiDialog-container.MuiDialog-scrollPaper.mui-hz1bth-MuiDialog-container > div': { maxWidth: 800 },
        }}
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Hotels</DialogTitle>
        <DialogContent>
          <HotelSliderDialog
            hotels={hotels}
            handleClose={handleClose}
            setHotelId={(hotelIds) => formik.setFieldValue('hotelId', hotelIds)}
          />
        </DialogContent>
        <DialogActions>
          <Stack sx={{ width: '100%' }}>
            <Stack>
              <Pagination
                count={Math.ceil(hotels.length / 10)}
                sx={{ display: 'flex', justifyContent: 'center' }}
                color="primary"
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
              />
            </Stack>
            <Stack direction="row" justifyContent="flex-end">
              <Button onClick={handleClose} variant="contained" sx={{ width: 'fit-content' }} color="primary">
                Close
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
