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
  Stack,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';

import { validationRoom } from '@/lib/yub/index';
import { CreateRoomRequestDto } from '@/types/rooms';
import { RoomType } from '@/types/rooms';
import { roomApi } from '@/lib/room/room';
import { hotelApi } from '@/lib/hotel/hotel';

interface RoomUpdateProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
}

export function RoomUpdate(props: RoomUpdateProps): React.ReactElement {
  const { open, onClose, roomId } = props;
  const [hotelName, setHotelName] = useState<{ id: string; name: string }[]>([]);

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
    onSubmit: async () => {
      await roomApi.updateRoom(formik.values, roomId);
      formik.resetForm();
      onClose();
    },
  });

  const handleSubmit = async (): Promise<void> => {
    // await roomApi.updateRoom(formik.values, roomId);
    // formik.resetForm();
    // onClose();
  };

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
          status: response.data.status ?? true,
          hotelName: response.data.hotelName ?? '',
        });
      }
    }
    if (open) {
      void fetchData();
    }
  }, [open, roomId]);

  useEffect(() => {
    const fetchHotelNames = async (): Promise<void> => {
      const response = await hotelApi.searchHotelName();
      setHotelName(response.data ?? []);
    };
    void fetchHotelNames();
  }, []);

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
              Update Room
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Hotel"
                  variant="outlined"
                  fullWidth
                  name="hotelId"
                  value={formik.values.hotelId}
                  onChange={formik.handleChange}
                  error={formik.touched.hotelId ? Boolean(formik.errors.hotelId) : undefined}
                  helperText={formik.touched.hotelId ? formik.errors.hotelId : null}
                >
                  {hotelName.map((hotel) => (
                    <MenuItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container spacing={2}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Room Type"
                    variant="outlined"
                    fullWidth
                    name="roomType"
                    value={formik.values.roomType}
                    onChange={formik.handleChange}
                    error={formik.touched.roomType ? Boolean(formik.errors.roomType) : undefined}
                    helperText={formik.touched.roomType ? formik.errors.roomType : null}
                  >
                    {Object.values(RoomType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Status"
                    variant="outlined"
                    fullWidth
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status ? Boolean(formik.errors.status) : undefined}
                    helperText={formik.touched.status ? formik.errors.status : null}
                  >
                    <MenuItem value={"true"}>Active</MenuItem>
                    <MenuItem value={"false"}>InActive</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" width="100%" justifyContent="space-around">
              <Button type="submit" variant="contained" sx={{ marginTop: 2 }} onClick={handleSubmit}>
                Update Room
              </Button>
              <Button onClick={onClose} variant="contained" sx={{ marginTop: 2 }}>
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
