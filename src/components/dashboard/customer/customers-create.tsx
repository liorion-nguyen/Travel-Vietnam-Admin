'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Dialog, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { RegisterValues, Status, userApi } from '@/lib/user/user';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MuiTelInput } from 'mui-tel-input';
import { toast } from 'react-toastify';

const initialValues: RegisterValues = {
  email: '',
  fullName: '',
  dateOfBirth: null,
  address: {
    province: '',
    district: '',
    ward: '',
  },
  phone: {
    country: '+ 84',
    number: '',
  },
  role: 'User',
  status: 'ACTIVE',
  avatar: '',
};

interface Location {
  id: string;
  name: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Must be a valid email')
    .max(255, 'Email must be at most 255 characters')
    .required('Email is required'),

  fullName: Yup.string().max(255, 'Full name must be at most 255 characters').required('Full name is required'),

  status: Yup.string().required('Status is required'),

  dateOfBirth: Yup.date().required('Date of birth is required'),

  address: Yup.object({
    province: Yup.string().required('Province is required'),
    district: Yup.string().required('District is required'),
    ward: Yup.string().required('Ward is required'),
  }),

  phone: Yup.object({
    country: Yup.string().required('Country code is required'),
    number: Yup.string()
      .max(9, 'Number phone must be at most 9 characters')
      .matches(/^\d{8,11}$/, 'Phone number must be between 8 and 11 digits')
      .required('Phone number is required'),
  }),
  role: Yup.string().required('Role is required'),
});

export function RegisterForm(): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddClick = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (): Promise<void> => {
      toast.success('Create user successfully');
    },
  });
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [imgProfile, setImgProfile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const status = Object.values(Status);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    void fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => response.json())
      .then((data: { data?: Location[] }) => {
        setProvinces(data?.data || []);
      });
    
    const fetchRoles = async (): Promise<void> => {
      const data = await userApi.getAllRoles();
      setRoles(data?.data || []);
    };
    void fetchRoles();
  }, []);

  useEffect(() => {
    if (formik.values.address.province) {
      void fetch(`https://esgoo.net/api-tinhthanh/2/${formik.values.address.province}.htm`)
        .then((response) => response.json())
        .then((data: { data?: Location[] }) => {
          setDistricts(data?.data || []);
        });
    }
  }, [formik.values.address.province]);

  useEffect(() => {
    if (formik.values.address.district) {
      void fetch(`https://esgoo.net/api-tinhthanh/3/${formik.values.address.district}.htm`)
        .then((response) => response.json())
        .then((data: { data: Location[] } | undefined | null) => {
          setWards(data?.data || []);
        });
    }
  }, [formik.values.address.district]);

  const handleSubmit = async (): Promise<void> => {
    const data: RegisterValues = {
      email: formik.values.email || '',
      fullName: formik.values.fullName || '',
      password: formik.values.password || '',
      dateOfBirth: formik.values.dateOfBirth || null,
      address: {
        province: formik.values.address?.province || '',
        district: formik.values.address?.district || '',
        ward: formik.values.address?.ward || '',
      },
      phone: {
        country: formik.values.phone?.country || '',
        number: formik.values.phone?.number || '',
      },
      role: formik.values.role || '',
      status: formik.values.status || '',
      avatar: formik.values.avatar || '',
    };
    void (await userApi.createUser(data));
    toast.success('Create user successfully');
    handleCloseDialog();
  };

  const handleIconClick = (): void => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target?.files?.[0];
    if (file) {
      setImgProfile(file);
    }
  };

  return (
    <>
      <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAddClick}>
        Add
      </Button>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Stack spacing={4} padding={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Create User</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} mb={4}>
              <Box
                sx={{
                  height: '200px',
                  width: '200px',
                  position: 'relative',
                }}
              >
                <Avatar
                  alt="Remy Sharp"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    boxShadow: '',
                    objectFit: 'cover',
                  }}
                  src={imgProfile ? URL.createObjectURL(imgProfile) : ''}
                />
                <CameraEnhanceIcon
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    fontSize: '35px',
                    opacity: '0.7',
                    ':hover': {
                      opacity: '0.9',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={handleIconClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                fullWidth
                helperText={formik.touched.fullName ? formik.errors.fullName : null}
                label="Full Name"
                name="fullName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email ? formik.errors.email : null}
                label="Email address"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                error={Boolean(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password ? formik.errors.password : null}
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: '100%' }}
                  label="Date of Birth"
                  value={formik.values.dateOfBirth}
                  onChange={(date: Dayjs | null) => formik.setFieldValue('dateOfBirth', date)}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Province"
                name="address.province"
                value={formik.values.address?.province}
                onChange={(value) => formik.setFieldValue('address.province', value.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.province ? Boolean(formik.errors.address?.province) : undefined}
                helperText={formik.touched.address?.province ? formik.errors.address?.province : undefined}
                fullWidth
              >
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.id}>
                    {province.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="District"
                name="address.district"
                value={formik.values.address?.district}
                onChange={(value) => formik.setFieldValue('address.district', value.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.district ? Boolean(formik.errors.address?.district) : undefined}
                helperText={formik.touched.address?.district ? formik.errors.address?.district : undefined}
                fullWidth
                disabled={!formik.values.address?.province}
              >
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.id}>
                    {district.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Ward"
                name="address.ward"
                value={formik.values.address?.ward}
                onChange={(value) => formik.setFieldValue('address.ward', value.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.ward ? Boolean(formik.errors.address?.ward) : undefined}
                helperText={formik.touched.address?.ward ? formik.errors.address?.ward : null}
                fullWidth
                disabled={!formik.values.address?.district}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.id} value={ward.id}>
                    {ward.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <MuiTelInput
                sx={{ width: '170px' }}
                value={formik.values.phone.country}
                name="phone.country"
                onChange={(value) => formik.setFieldValue('phone.country', value)}
                onBlur={formik.handleBlur}
                error={formik.touched.phone?.country ? Boolean(formik.errors.phone?.country) : undefined}
                helperText={formik.touched.phone?.country ? formik.errors.phone?.country : null}
                defaultCountry="VN"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                error={Boolean(formik.touched.phone?.number && formik.errors.phone?.number)}
                fullWidth
                helperText={formik.touched.phone?.number ? formik.errors.phone?.number : null}
                label="Phone Number"
                name="phone.number"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    void formik.setFieldValue('phone.number', value);
                  }
                }}
                value={formik.values.phone.number}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={(value) => formik.setFieldValue('status', value.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.status ? Boolean(formik.errors.status) : undefined}
              helperText={formik.touched.status ? formik.errors.status : null}
            fullWidth
          >
            {status.map((s: string) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
                label="Role"
                name="role"
                value={formik.values.role}
                onChange={(value) => formik.setFieldValue('role', value.target.value)}
                onBlur={formik.handleBlur}
                error={formik.touched.role ? Boolean(formik.errors.role) : undefined}
                helperText={formik.touched.role ? formik.errors.role : undefined}
                fullWidth
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Button variant="contained" type="submit" sx={{ marginTop: 2 }} onClick={handleSubmit}>
            Create User
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}
