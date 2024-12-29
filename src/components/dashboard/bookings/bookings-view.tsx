'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
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

import { validationBooking } from '@/lib/yub/index';
import { Booking, BookingStatus, BookingType } from '@/types/booking';
import { bookingApi } from '@/lib/booking/booking';

interface BookingViewProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
}

export function BookingView(props: BookingViewProps): React.ReactElement {
  const { open, onClose, bookingId } = props;

  const formik = useFormik<Booking>({
    initialValues: {
      userId: '',
      orderId: '',
      amount: 0,
      vnpayCode: '',
      status: BookingStatus.PENDING,
      bookingType: BookingType.TOURS,
      guestSize: 0,
    },
    validationSchema: validationBooking,
    onSubmit: async () => {
      onClose();
    },
  });

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await bookingApi.getBooking(bookingId);
      if (response.data) {
        void formik.setValues({
          userId: response.data.userId,
          orderId: response.data.orderId,
          amount: response.data.amount,
          vnpayCode: response.data.vnpayCode,
          status: response.data.status,
          bookingType: response.data.bookingType,
          guestSize: response.data.guestSize,
        });
      }
    }
    if (open) {
      void fetchData();
    }
  }, [open]);
  const getStatusChip = (status: BookingStatus): React.ReactNode => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Chip label={BookingStatus.CONFIRMED} color="success" sx={{ width: '100%', height: '40px' }} />;
      case BookingStatus.PENDING:
        return <Chip label={BookingStatus.PENDING} color="warning" sx={{ width: '100%', height: '40px' }} />;
      case BookingStatus.CANCELLED:
        return <Chip label={BookingStatus.CANCELLED} color="error" sx={{ width: '100%', height: '40px' }} />;
      default:
        return <Chip label={status} />;
    }
  };
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
              View Booking
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginY: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="User ID"
                      variant="outlined"
                      fullWidth
                      name="userId"
                      value={formik.values.userId}
                      onChange={formik.handleChange}
                      error={formik.touched.userId ? Boolean(formik.errors.userId) : undefined}
                      helperText={formik.touched.userId ? formik.errors.userId : null}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Order ID"
                      variant="outlined"
                      fullWidth
                      name="orderId"
                      value={formik.values.orderId}
                      onChange={formik.handleChange}
                      error={formik.touched.orderId ? Boolean(formik.errors.orderId) : undefined}
                      helperText={formik.touched.orderId ? formik.errors.orderId : null}
                      disabled
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box>
                    <TextField
                      label="Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      error={formik.touched.amount ? Boolean(formik.errors.amount) : undefined}
                      helperText={formik.touched.amount ? formik.errors.amount : null}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <TextField
                      label="Vnpay Code"
                      type="number"
                      variant="outlined"
                      fullWidth
                      name="vnpayCode"
                      value={formik.values.vnpayCode}
                      onChange={formik.handleChange}
                      error={formik.touched.vnpayCode ? Boolean(formik.errors.vnpayCode) : undefined}
                      helperText={formik.touched.vnpayCode ? formik.errors.vnpayCode : null}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Booking Type"
                    variant="outlined"
                    fullWidth
                    name="bookingType"
                    value={formik.values.bookingType}
                    onChange={formik.handleChange}
                    error={formik.touched.bookingType ? Boolean(formik.errors.bookingType) : undefined}
                    helperText={formik.touched.bookingType ? formik.errors.bookingType : null}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  {getStatusChip(formik.values.status)}
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
