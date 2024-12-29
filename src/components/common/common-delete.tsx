import React from 'react';
import { Button, DialogContent, DialogTitle, Stack } from '@mui/material';

import { DialogCommon } from '@/components/common/dialog-common';

interface TourDeleteProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
}

export function CommonDelete(props: TourDeleteProps): React.ReactElement {
  const { open, onClose, onDelete, title } = props;

  return (
    <DialogCommon open={open} onClose={onClose}>
      <DialogTitle> Do you want to delete {title}?</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} justifyContent="space-around">
          <Button onClick={onDelete} variant="contained" color="error" aria-label="Delete">
            Xóa
          </Button>
          <Button onClick={onClose} variant="outlined" color="primary" aria-label="Cancel">
            Hủy
          </Button>
        </Stack>
      </DialogContent>
    </DialogCommon>
  );
}
