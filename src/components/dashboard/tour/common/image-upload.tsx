import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardActions, CardMedia, Grid, Stack, Typography } from '@mui/material';

interface ImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  error?: string | string[] | undefined;
  disabled?: boolean;
}

export function ImageUpload(props: ImageUploadProps): React.ReactElement {
  const { images, setImages, error, disabled = false } = props;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;

    if (files) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      const fileArray: string[] = [];

      const fileListArray = Array.from(files);

      for (const file of fileListArray) {
        if (validImageTypes.includes(file.type)) {
          fileArray.push(URL.createObjectURL(file));
        }
      }

      if (fileArray.length > 0) {
        setImages([...images, ...fileArray]);
      }
    }
  };

  const handleRemoveImage = (index: number): void => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Stack>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {disabled ? 'View Photos' : 'Upload Photos'}
        </Typography>
        {!disabled ? (
          <Button
            variant="outlined"
            component="label"
            sx={{
              margin: '10px 0',
              color: '#1976d2',
              borderColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            }}
          >
            Choose images
            <input type="file" multiple accept="image/jpeg,image/png" onChange={handleImageChange} hidden />
          </Button>
        ) : null}

        {error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : null}
      </Stack>
      <Grid container spacing={1} sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', py: 2 }}>
        {images.map((image, index) => (
          <Grid item xs={6} sm={4} md={3} key={image}>
            <Card>
              <CardMedia
                component="img"
                image={image}
                alt={`Uploaded Image ${index + 1}`}
                sx={{ height: 140, objectFit: 'cover' }}
              />
              {!disabled ? (
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      handleRemoveImage(index);
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                      },
                    }}
                  >
                    Remove
                  </Button>
                </CardActions>
              ) : null}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
