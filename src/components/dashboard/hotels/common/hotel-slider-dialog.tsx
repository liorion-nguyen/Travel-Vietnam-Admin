import React from 'react';
import { DialogContent, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import Slider from 'react-slick';

import type { Hotel } from '@/types/hotel';
import { ItemCard } from '@/components/common/item-card';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface HotelSliderDialogProps {
  hotels: Hotel[];
  handleClose: () => void;
  setHotelId: (hotelId: string) => void;
}

export function HotelSliderDialog(props: HotelSliderDialogProps): React.ReactElement {
  const { hotels, handleClose, setHotelId } = props;

  const theme = useTheme();
  const isScreenSm = useMediaQuery(theme.breakpoints.up('sm'));

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <DialogContent>
      <Stack width="100%">
        {isScreenSm ? (
          <Grid container spacing={2}>
            {hotels.map((hotel) => (
              <Grid item xs={4} key={hotel._id}>
                <ItemCard
                  data={hotel}
                  onSelect={() => {
                    setHotelId(hotel._id || '');
                    handleClose();
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Slider {...settings}>
            {hotels.map((hotel) => (
              <Stack key={hotel._id}>
                <ItemCard
                  data={hotel}
                  onSelect={() => {
                    setHotelId;
                    handleClose();
                  }}
                />
              </Stack>
            ))}
          </Slider>
        )}
      </Stack>
    </DialogContent>
  );
}
