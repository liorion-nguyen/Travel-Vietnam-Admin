import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { AuthPermissionGuard } from '@/components/auth/auth-guard-permission';
import { RegisterForm } from '@/components/dashboard/customer/customers-create';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { CustomersDetails } from '@/components/dashboard/customer/customers-details';

export const metadata = { title: `Customers | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  return (
    <AuthPermissionGuard permissionRole="CUSTOMER_VIEW">
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Customers</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
                Export
              </Button>
            </Stack>
          </Stack>
          <div style={{ display: 'flex', gap: '10px', height: 'min-content' }}>
            <CustomersDetails />
            <RegisterForm />
          </div>
        </Stack>
        <CustomersTable />
      </Stack>
    </AuthPermissionGuard>
  );
}
