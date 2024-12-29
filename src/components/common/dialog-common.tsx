import React from 'react';
import { Dialog } from '@mui/material';

interface DialogCommonProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DialogCommon(props: DialogCommonProps): React.ReactElement {
  const { open, onClose, children } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
}
