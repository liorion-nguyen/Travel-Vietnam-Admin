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

import { validationRoom } from '@/lib/yub/index';
import { type CreateRoomRequestDto, RoomType } from '@/types/rooms';
import { roomApi } from '@/lib/room/room';

interface RoomViewProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
}

export function RoomView(props: RoomViewProps): React.ReactElement {
  const { open, onClose, roomId } = props;

  const formik = useFormik<CreateRoomRequestDto>({
    initialValues: {
      roomNumber: 0,
      description: '',
      price: 0,
      roomType: RoomType.STANDARD,
      maxOccupancy: 0,
      hotelId: '',
      hotelName: '',
      status: true,
    },
    validationSchema: validationRoom,
    onSubmit: async (values) => {
      await roomApi.updateRoom(values, roomId);
      formik.resetForm();
      onClose();
    },
  });

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await roomApi.getRoom(roomId);
      if (response.data) {
        void formik.setValues({
          roomNumber: response.data.roomNumber ?? 0,
          description: response.data.description ?? '',
          price: response.data.price ?? 0,
          roomType: response.data.roomType ?? RoomType.STANDARD,
          maxOccupancy: response.data.maxOccupancy ?? 0,
          hotelId: response.data.hotelId ?? '',
          hotelName: response.data.hotelName ?? '',
          status: response.data.status ?? true,
        });
      }
    }
    if (open) {
      void fetchData();
    }
  }, [open, roomId, formik]);

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
              View Room
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                  <TextField
                    label="Hotel"
                    type="text"
                    variant="outlined"
                    fullWidth
                    name="hotelName"
                    value={formik.values.hotelName}
                    onChange={formik.handleChange}
                    error={formik.touched.hotelName ? Boolean(formik.errors.hotelName) : undefined}
                    helperText={formik.touched.hotelName ? formik.errors.hotelName : null}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Room Number"
                      variant="outlined"
                      fullWidth
                      name="roomNumber"
                      value={formik.values.roomNumber}
                      onChange={formik.handleChange}
                      error={formik.touched.roomNumber ? Boolean(formik.errors.roomNumber) : undefined}
                      helperText={formik.touched.roomNumber ? formik.errors.roomNumber : null}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Room Type"
                    variant="outlined"
                    fullWidth
                    name="roomType"
                    value={formik.values.roomType}
                    onChange={formik.handleChange}
                    error={formik.touched.roomType ? Boolean(formik.errors.roomType) : undefined}
                    helperText={formik.touched.roomType ? formik.errors.roomType : null}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Max Occupancy"
                    type="number"
                    variant="outlined"
                    fullWidth
                    name="maxOccupancy"
                    value={formik.values.maxOccupancy}
                    onChange={formik.handleChange}
                    error={formik.touched.maxOccupancy ? Boolean(formik.errors.maxOccupancy) : undefined}
                    helperText={formik.touched.maxOccupancy ? formik.errors.maxOccupancy : null}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Status"
                    type="boolean"
                    variant="outlined"
                    fullWidth
                    name="status"
                    value={formik.values.status ? 'Active' : 'Inactive'}
                    onChange={formik.handleChange}
                    error={formik.touched.status ? Boolean(formik.errors.status) : undefined}
                    helperText={formik.touched.status ? formik.errors.status : null}
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
