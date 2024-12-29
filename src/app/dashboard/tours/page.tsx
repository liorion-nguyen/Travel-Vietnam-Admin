import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { AuthPermissionGuard } from '@/components/auth/auth-guard-permission';
import { CreateTour } from '@/components/dashboard/tour/tour-create';
import { TourTable } from '@/components/dashboard/tour/tour-table';

export const metadata = { title: `Tour | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <AuthPermissionGuard permissionRole="TOUR_VIEW">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Tour</Typography>
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
            <CreateTour />
          </Stack>
        </Stack>
        <TourTable />
      </Stack>
    </AuthPermissionGuard>
  );
}
