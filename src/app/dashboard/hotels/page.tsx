import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { AuthPermissionGuard } from '@/components/auth/auth-guard-permission';
import { CreateHotel } from '@/components/dashboard/hotels/hotel-create';
import { HotelTable } from '@/components/dashboard/hotels/hotel-table';

export const metadata = { title: `Hotels | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <AuthPermissionGuard permissionRole="HOTEL_VIEW">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Hotels</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
              </Button>
            </Stack>
          </Stack>
          <Stack>
            <CreateHotel />
          </Stack>
        </Stack>
        <HotelTable />
      </Stack>
    </AuthPermissionGuard>
  );
}
