import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { generateSponsorsExcel } from '../utils/sponsorService';

const SponsorRecommendations = ({ sponsors }) => {
  if (!sponsors || sponsors.length === 0) return null;

  const handleDownload = () => {
    generateSponsorsExcel(sponsors);
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'platinum':
        return 'primary';
      case 'gold':
        return 'warning';
      case 'silver':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Potential Sponsors
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download Sponsor List
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Contact Details</TableCell>
              <TableCell>Sponsorship Range</TableCell>
              <TableCell>Event Preferences</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sponsors.map((sponsor, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Typography variant="subtitle2">
                    {sponsor.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sponsor.contactPerson}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={sponsor.category}
                    color={getCategoryColor(sponsor.category)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{sponsor.industry}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      {sponsor.email}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" />
                      {sponsor.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize="small" />
                      {sponsor.address}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{sponsor.sponsorshipRange}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {sponsor.preferredEvents}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Past Events: {sponsor.pastEvents}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SponsorRecommendations;
