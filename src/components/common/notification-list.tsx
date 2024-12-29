// components/NotificationList.tsx
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';

import type { Notification } from '@/types/notification';

interface NotificationListProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  notifications: Notification[];
}

export function NotificationList(props: NotificationListProps): React.ReactElement {
  const { anchorEl, onClose, notifications } = props;
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = (): void => {
    setShowMore(true);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" pb={1}>
          Notifications
        </Typography>
        <Divider />
        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              (showMore ? notifications : notifications.slice(0, 3)).map((notification) => (
                <ListItem key={notification.id} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={notification.avatar} alt={notification.name} sx={{ mr: 2 }} />
                  <ListItemText
                    primary={
                      <Tooltip title={notification.name} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            fontWeight: 600,
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {notification.name}
                        </Typography>
                      </Tooltip>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          maxHeight: '40px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {notification.message}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
        {notifications.length > 3 ? (
          <Button variant="outlined" onClick={handleShowMore} sx={{ mt: 1, width: '100%' }}>
            Show More
          </Button>
        ) : null}
      </Box>
    </Popover>
  );
}
