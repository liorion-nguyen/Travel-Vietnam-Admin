'use client';

import React, { useEffect, useState } from 'react';
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
import { useFormik } from 'formik';

import { type Hotel } from '@/types/hotel';
import { type CreateTourForm } from '@/types/tour';
import { hotelApi } from '@/lib/hotel/hotel';
import { tourApi } from '@/lib/tour/tour';
import { validationTour } from '@/lib/yub/index';

import { AddressForm } from './common/address-form';
import { HotelSliderDialog } from './common/hotel-slider-dialog';
import { ImageUpload } from './common/image-upload';

interface TourUpdateProps {
  open: boolean;
  onClose: () => void;
  tourId: string;
}

export function TourView(props: TourUpdateProps): React.ReactElement {
  const { open, onClose, tourId } = props;
  const [openHotel, setOpenHotel] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(true);

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
      await tourApi.updateTour(values, tourId);
      formik.resetForm();
      onClose();
    },
  });

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await tourApi.getTour(tourId);
      if (response.data) {
        void formik.setValues({
          files: response.data.photos,
          title: response.data.title,
          desc: response.data.desc,
          price: response.data.price,
          maxGroupSize: response.data.maxGroupSize,
          hotelId: response.data.hotelId,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          destination: response.data.destination,
          departurePoint: response.data.departurePoint,
        });
      }
    }
    if (open) {
      void fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This is a false positive
  }, [open]);

  const handleClickOpen = async (): Promise<void> => {
    const response = await hotelApi.searchHotels({ limit: 10, page });
    setHotels(response.data || []);
    setOpenHotel(true);
    setVisible(false);
  };

  const handleClose = (): void => {
    setOpenHotel(false);
    setVisible(true);
  };

  return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-container.MuiDialog-scrollPaper.mui-hz1bth-MuiDialog-container > div': {
            maxWidth: 800,
            visibility: visible ? 'visible' : 'hidden',
          },
        }}
        open={open}
        onClose={onClose}
        fullWidth
      >
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <DialogTitle>
            <Typography variant="h3" textAlign="center" sx={{ fontWeight: 'bold' }}>
              View Tour
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
                    disabled
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
                      name="desc"
                      value={formik.values.desc}
                      onChange={formik.handleChange}
                      error={formik.touched.desc ? Boolean(formik.errors.desc) : undefined}
                      helperText={formik.touched.desc ? formik.errors.desc : null}
                      disabled
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
                      disabled
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
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button fullWidth sx={{ height: '100%' }} variant="contained" onClick={handleClickOpen}>
                    View Hotel
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
                <AddressForm
                  addressType="destination"
                  address={formik.values.destination}
                  setAddress={(newAddress) => formik.setFieldValue('destination', newAddress)}
                  formik={formik}
                  disabled
                />
                <AddressForm
                  addressType="departurePoint"
                  address={formik.values.departurePoint}
                  setAddress={(newAddress) => formik.setFieldValue('departurePoint', newAddress)}
                  formik={formik}
                  disabled
                />
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

      <Dialog
        sx={{
          '& .MuiDialog-container.MuiDialog-scrollPaper.mui-hz1bth-MuiDialog-container > div': { maxWidth: 800 },
        }}
        open={openHotel}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Hotels</DialogTitle>
        <DialogContent>
          <HotelSliderDialog
            hotels={[hotels.find((item) => item._id === formik.values.hotelId) || { photos: [] }]}
            handleClose={handleClose}
            setHotelId={(hotelIds) => formik.setFieldValue('hotelId', hotelIds)}
          />
        </DialogContent>
        <DialogActions>
          <Stack sx={{ width: '100%' }}>
            <Stack>
              {hotels.length / 10 > 1 ? (
                <Pagination
                  count={Math.ceil(hotels.length / 10)}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  color="primary"
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                />
              ) : null}
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
