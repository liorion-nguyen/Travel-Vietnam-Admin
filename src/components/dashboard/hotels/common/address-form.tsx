import React, { useEffect, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';

import type { Address, Location } from '@/types';

interface AddressFormProps {
  addressType: 'destination' | 'departurePoint' | 'address';
  address: Address;
  setAddress: (newAddress: Address) => void;
  formik: {
    touched: {
      destination?: {
        province?: boolean;
        district?: boolean;
        ward?: boolean;
      };
      departurePoint?: {
        province?: boolean;
        district?: boolean;
        ward?: boolean;
      };
      address?: {
        province?: boolean;
        district?: boolean;
        ward?: boolean;
      };
    };
    errors: {
      destination?: {
        province?: string;
        district?: string;
        ward?: string;
      };
      departurePoint?: {
        province?: string;
        district?: string;
        ward?: string;
      };
      address?: {
        province?: string;
        district?: string;
        ward?: string;
      };
    };
  };
  disabled?: boolean;
}

export function AddressForm(props: AddressFormProps): React.ReactElement {
  const { addressType, address, setAddress, formik, disabled = false } = props;

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  useEffect(() => {
    void fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => response.json())
      .then((data: { data: Location[] }) => {
        setProvinces(data?.data);
      });
  }, []);

  useEffect(() => {
    if (address.province) {
      void fetch(`https://esgoo.net/api-tinhthanh/2/${address.province}.htm`)
        .then((response) => response.json())
        .then((data: { data: Location[] }) => {
          setDistricts(data?.data);
        });
    } else {
      setDistricts([]);
    }
  }, [address.province]);

  useEffect(() => {
    if (address.district) {
      void fetch(`https://esgoo.net/api-tinhthanh/3/${address.district}.htm`)
        .then((response) => response.json())
        .then((data: { data: Location[] }) => {
          setWards(data?.data);
        });
    } else {
      setWards([]);
    }
  }, [address.district]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: 'province' | 'district' | 'ward'
  ): void => {
    const selectedValue = e.target.value;
    const newAddress = { ...address, [field]: selectedValue };

    if (field === 'province') {
      newAddress.district = '';
      newAddress.ward = '';
    }

    if (field === 'district') {
      newAddress.ward = '';
    }

    setAddress(newAddress);
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">{addressType === 'address' ? 'Address' : addressType === 'destination' ? 'Destination' : 'Departure Point'}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          variant="outlined"
          onChange={(e) => {
            handleAddressChange(e, 'province');
          }}
          required
          value={address.province || ''}
          fullWidth
          label="Province"
          error={formik.touched[addressType]?.province ? Boolean(formik.errors[addressType]?.province) : undefined}
          helperText={formik.touched[addressType]?.province ? formik.errors[addressType]?.province : null}
          SelectProps={{ native: true }}
          disabled={disabled}
        >
          <option value="" disabled />
          {provinces.map((province: Location) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          variant="outlined"
          onChange={(e) => {
            handleAddressChange(e, 'district');
          }}
          required
          label="District"
          value={address.district || ''}
          disabled={!address.province || disabled}
          fullWidth
          error={formik.touched[addressType]?.district ? Boolean(formik.errors[addressType]?.district) : undefined}
          helperText={formik.touched[addressType]?.district ? formik.errors[addressType]?.district : null}
          SelectProps={{ native: true }}
        >
          <option value="" disabled />
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          variant="outlined"
          onChange={(e) => {
            handleAddressChange(e, 'ward');
          }}
          label="Ward"
          required
          value={address.ward || ''}
          disabled={!address.district || disabled}
          fullWidth
          error={formik.touched[addressType]?.ward ? Boolean(formik.errors[addressType]?.ward) : undefined}
          helperText={formik.touched[addressType]?.ward ? formik.errors[addressType]?.ward : null}
          SelectProps={{ native: true }}
        >
          <option value="" disabled />
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </TextField>
      </Grid>
    </>
  );
}
