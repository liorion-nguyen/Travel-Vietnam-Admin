import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem, Stack } from '@mui/material';

import type { Roles } from '@/types/roles';
import { type Tour } from '@/types/tour';
import { rolesApi } from '@/lib/roles/roles';
import { tourApi } from '@/lib/tour/tour';

import { UpdateRoles } from '../dashboard/roles/roles-update';
import { ViewRoles } from '../dashboard/roles/roles-view';
import { UpdateTour } from '../dashboard/tour/tour-update';
import { TourView } from '../dashboard/tour/tour-view';
import { CommonDelete } from './common-delete';
import type { Hotel, Room } from '@/types/hotel';
import { UpdateHotel } from '../dashboard/hotels/hotel-update';
import { HotelView } from '../dashboard/hotels/hotel-view';
import { Booking } from '@/types/booking';
import { BookingView } from '../dashboard/bookings/bookings-view';
import { bookingApi } from '@/lib/booking/booking';
import { UpdateDiscount } from '../dashboard/discounts/discounts-update';
import { DiscountView } from '../dashboard/discounts/discounts-view';
import { Discount } from '@/types/discounts';
import { discountApi } from '@/lib/discount/discount';
import { RoomUpdate } from '../dashboard/rooms/rooms-update';
import { RoomView } from '../dashboard/rooms/rooms-view';
import { roomApi } from '@/lib/room/room';
import { toast } from 'react-toastify';

interface ActionCellProps {
  data: Tour | Roles | Hotel | Booking | Discount | Room;
}

export function ActionCell(props: ActionCellProps): React.ReactElement {
  const { data } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const handleCloseDiaLog = (): void => {
    setOpenDialog(false);
  };
  const handleOpenDiaLog = (): void => {
    setOpenDialog(true);
  };

  const handleView = (): void => {
    setAction('view');
    handleOpenDiaLog();
    handleClose();
  };

  const handleOpenDelete = (): void => {
    setAction('delete');
    handleOpenDiaLog();
    handleClose();
  };

  const handleUpdate = (): void => {
    setAction('update');
    handleOpenDiaLog();
    handleClose();
  };

  const handleDelete = async (): Promise<void> => {
    if ('hotelId' in data && !('roomNumber' in data)) {
      await tourApi.deleteTour(data?._id || '');
    } else if ('name' in data) {
      await rolesApi.deleteRole('id' in data ? data?.id : '');
    } else if ('orderId' in data) {
      await bookingApi.deleteBooking(data?._id || '');
    } else if ('code' in data) {
      await discountApi.deleteDiscount(data?._id || '');
    } else if ('maxOccupancy' in data) {
      await roomApi.deleteRoom(data?._id || '');
    }
    toast.success('Deleted successfully');
    handleCloseDiaLog();
  };
  return (
    <Stack>
      <IconButton aria-controls={open ? 'simple-menu' : undefined} aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleView}>View</MenuItem>
        {data && !('amount' in data) && <MenuItem onClick={handleUpdate}>Update</MenuItem>}
        {data && !('amount' in data) && <MenuItem onClick={handleOpenDelete}>Delete</MenuItem>}
      </Menu>
      {data && 'amount' in data ? (
        action === 'view' && <BookingView open={openDialog} onClose={handleCloseDiaLog} bookingId={data._id || ''} />
      ) : null}
      {data && 'min_order_value' in data ? (
        <>
          {action === 'delete' && (
            <CommonDelete
              open={openDialog}
              onClose={handleCloseDiaLog}
              onDelete={handleDelete}
              title={('description' in data && data?.description) || ''}
            />
          )}
          {action === 'update' && <UpdateDiscount open={openDialog} onClose={handleCloseDiaLog} discountId={data._id || ''} />}
          {action === 'view' && <DiscountView open={openDialog} onClose={handleCloseDiaLog} discountId={data._id || ''} />}
        </>
      ) : null}

      {data && 'hotelId' in data && !('roomNumber' in data) ? (
        <>
          {action === 'delete' && (
            <CommonDelete
              open={openDialog}
              onClose={handleCloseDiaLog}
              onDelete={handleDelete}
              title={('title' in data && data?.title) || ''}
            />
          )}
          {action === 'update' && <UpdateTour open={openDialog} onClose={handleCloseDiaLog} tourId={data._id || ''} />}
          {action === 'view' && <TourView open={openDialog} onClose={handleCloseDiaLog} tourId={data._id || ''} />}
        </>
      ) : null}

      {data && 'maxOccupancy' in data ? (
        <>
          {action === 'delete' && (
            <CommonDelete
              open={openDialog}
              onClose={handleCloseDiaLog}
              onDelete={handleDelete}
              title={('roomNumber' in data && data?.roomNumber?.toString()) || ''}
            />
          )}
          {action === 'update' && <RoomUpdate open={openDialog} onClose={handleCloseDiaLog} roomId={data._id || ''} />}
          {action === 'view' && <RoomView open={openDialog} onClose={handleCloseDiaLog} roomId={data._id || ''} />}
        </>
      ) : null}

      {data && 'amenities' in data ? (
        <>
          {action === 'delete' && (
            <CommonDelete
              open={openDialog}
              onClose={handleCloseDiaLog}
              onDelete={handleDelete}
              title={('name' in data && data?.name) || ''}
            />
          )}
          {action === 'update' && <UpdateHotel open={openDialog} onClose={handleCloseDiaLog} hotelId={data._id || ''} />}
          {action === 'view' && <HotelView open={openDialog} onClose={handleCloseDiaLog} hotelId={data._id || ''} />}
        </>
      ) : null}

      {data && 'permissions' in data ? (
        <>
          {action === 'delete' && (
            <CommonDelete
              open={openDialog}
              onClose={handleCloseDiaLog}
              onDelete={handleDelete}
              title={('name' in data && data?.name) || ''}
            />
          )}
          {action === 'update' && (
            <UpdateRoles open={openDialog} onClose={handleCloseDiaLog} roleId={'id' in data ? data?.id : ''} />
          )}

          {action === 'view' && (
            <ViewRoles open={openDialog} onClose={handleCloseDiaLog} roleId={'id' in data ? data?.id : ''} />
          )}
        </>
      ) : null}
    </Stack>
  );
}
