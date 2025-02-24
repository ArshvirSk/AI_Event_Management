import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Grid,
  Link,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const VendorRecommendations = ({ vendors, city }) => {
  const center = {
    lat: vendors[0]?.location.lat || 20.5937,
    lng: vendors[0]?.location.lng || 78.9629
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recommended Vendors & Locations
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <List>
            {vendors.map((vendor, index) => (
              <ListItem key={index} alignItems="flex-start" 
                sx={{ 
                  mb: 2, 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <StorefrontIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      {vendor.name}
                      <Chip
                        icon={<StarIcon sx={{ fontSize: '16px !important' }} />}
                        label={vendor.rating}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {vendor.category}
                      </Typography>
                      <Typography component="div" variant="body2">
                        <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom' }} />
                        {vendor.address}
                      </Typography>
                      <Typography component="div" variant="body2">
                        Contact: <Link href={`tel:${vendor.phone}`}>{vendor.phone}</Link>
                      </Typography>
                      {vendor.specialization && (
                        <Typography component="div" variant="body2">
                          Specialization: {vendor.specialization}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={11}
            >
              {vendors.map((vendor, index) => (
                <Marker
                  key={index}
                  position={vendor.location}
                  title={vendor.name}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default VendorRecommendations;
