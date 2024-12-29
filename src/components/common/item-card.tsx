'use client';

import React from 'react';
import { Box, Button, Card, CardContent, Rating, Typography } from '@mui/material';

import { type Hotel } from '@/types/hotel';

export interface DataProps {
  data: Hotel;
  onSelect?: (id: string) => void;
}

export function ItemCard(props: DataProps): React.ReactElement {
  const { _id, name, reviews, address, price, photos } = props.data;
  const { onSelect } = props;

  const averageRating = reviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 5;

  return (
    <Box sx={{ marginBottom: '24px' }}>
      <Card sx={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 18px 50px -10px', border: 'none' }}>
        <Box sx={{ position: 'relative' }}>
          <img
            src={photos?.[0] || ''}
            alt="tour-img"
            style={{ width: '100%', height: '100px', borderRadius: '5px 5px 0 0' }}
          />
          {averageRating > 4 && (
            <Box
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#ff7e01',
                color: '#fff',
                padding: '0.1rem 0.3rem',
                borderRadius: '3px 0 0 0',
              }}
            >
              Featured
            </Box>
          )}
        </Box>

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0b2727', fontWeight: 500 }}>
              {address ? address?.province : ''}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontSize: '0.8rem',
                color: '#6e7074',
              }}
            >
              <Rating name="half-rating-read" defaultValue={averageRating} precision={0.5} readOnly />
              <p>{averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}</p>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ marginTop: '1rem', fontSize: '1rem', cursor: 'pointer' }}>
            {name}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <Typography variant="h6" sx={{ color: '#faa935', fontWeight: 700 }}>
              {`${price}/ 1 room`}
            </Typography>

            <Button
              sx={{
                backgroundColor: '#faa935',
                padding: '0.6rem',
                borderRadius: '14px 0 14px 0',
                transition: '0.5s',
                cursor: 'pointer',
                fontStyle: 'italic',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: 'purple',
                },
              }}
              onClick={() => {
                onSelect && onSelect(_id ?? '');
              }}
              variant="contained"
            >
              Select
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
