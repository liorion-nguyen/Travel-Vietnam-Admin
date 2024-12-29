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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useFormik } from 'formik';

import { validationRoom } from '@/lib/yub';
import { roomApi } from '@/lib/room/room';
import { RoomType } from '@/types/rooms';
import { CreateRoomRequestDto } from '@/types/rooms';
import { hotelApi } from '@/lib/hotel/hotel';
import { toast } from 'react-toastify';

export function CreateRoom(): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hotelName, setHotelName] = useState<{ id: string; name: string }[]>([]);
  const [visible, setVisible] = useState(false);
  const formik = useFormik<CreateRoomRequestDto>({
    initialValues: {
      roomNumber: 0,
      price: 0,
      roomType: RoomType.STANDARD,
      description: '',
      maxOccupancy: 0,
      hotelId: '',
      hotelName: '',
      status: false,
    },
    validationSchema: validationRoom,
    onSubmit: async (): Promise<void> => {
      toast.success('Create room successfully');
    },
  });

  const handleSubmit = async (): Promise<void> => {
    await roomApi.createRoom(formik.values);
    formik.resetForm();
    handleCloseDialog();
  };

  const handleAddClick = (): void => {
    setDialogOpen(true);
    setVisible(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
    formik.resetForm();
  };

  useEffect(() => {
    const fetchHotelName = async (): Promise<void> => {
      const response = await hotelApi.searchHotelName();
      setHotelName(response.data ?? []);
    };
    void fetchHotelName();
  }, []);

  return (
    <>
      <Button variant="outlined" startIcon={<PlusIcon />} onClick={handleAddClick}>
        Create New Room
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
              Create New Room
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
                    value={formik.values.status.toString()}
                    onChange={formik.handleChange}
                    error={formik.touched.status ? Boolean(formik.errors.status) : undefined}
                    helperText={formik.touched.status ? formik.errors.status : null}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">InActive</MenuItem>
                  </TextField>
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
                onClick={handleSubmit}
              >
                Create Room
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
