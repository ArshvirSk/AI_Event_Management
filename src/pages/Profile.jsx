import {
  AutoAwesome,
  Cancel,
  Edit,
  Event,
  Lightbulb,
  Save,
  School,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [profile, setProfile] = useState({
    eventName: "",
    eventDate: "",
    eventType: "",
    eventDescription: "",
    eventWebsite: "",
    expectedParticipants: "",
    collegeName: "",
    collegeAddress: "",
    collegeEmail: "",
    collegePhone: "",
    department: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await updateDoc(doc(db, "profiles", userId), profile);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const generateSuggestions = () => {
    const suggestions = [];

    // Event type specific suggestions
    if (profile.eventType?.toLowerCase().includes("hackathon")) {
      suggestions.push({
        title: "Hackathon Best Practices",
        items: [
          "Consider offering pre-event workshops on popular technologies",
          "Partner with tech companies for mentorship",
          "Plan for adequate power outlets and internet bandwidth",
          "Include both technical and non-technical prize categories",
          "Provide API documentation and starter kits",
        ],
      });
    }

    // Participant count based suggestions
    const participants = parseInt(profile.expectedParticipants);
    if (participants > 200) {
      suggestions.push({
        title: "Large Event Management",
        items: [
          "Implement a multi-track registration system",
          "Consider parallel sessions to manage crowd flow",
          "Plan for multiple food service stations",
          "Set up dedicated help desks for different queries",
          "Use a mobile app for real-time updates",
        ],
      });
    }

    // Time-based suggestions
    const eventDate = new Date(profile.eventDate);
    const today = new Date();
    const monthsToEvent = (eventDate - today) / (1000 * 60 * 60 * 24 * 30);

    if (monthsToEvent > 3) {
      suggestions.push({
        title: "Early Planning Recommendations",
        items: [
          "Start early bird registration campaign",
          "Begin sponsor outreach program",
          "Create content calendar for social media",
          "Plan promotional events at nearby colleges",
          "Design merchandise and swag items",
        ],
      });
    } else if (monthsToEvent > 0 && monthsToEvent <= 1) {
      suggestions.push({
        title: "Final Month Checklist",
        items: [
          "Confirm all vendor arrangements",
          "Send final participant communications",
          "Test all technical infrastructure",
          "Prepare registration desk workflow",
          "Conduct volunteer orientation",
        ],
      });
    }

    return suggestions;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Event Profile</Typography>
        <Box>
          <Tooltip title="View AI Suggestions">
            <IconButton
              color="primary"
              onClick={() => setSuggestionsOpen(true)}
              sx={{ mr: 1 }}
            >
              <AutoAwesome />
            </IconButton>
          </Tooltip>
          {editing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                display="flex"
                alignItems="center"
              >
                <Event sx={{ mr: 1 }} />
                Event Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    name="eventName"
                    value={profile.eventName}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={profile.eventDate}
                    onChange={handleChange}
                    disabled={!editing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Type"
                    name="eventType"
                    value={profile.eventType}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Description"
                    name="eventDescription"
                    value={profile.eventDescription}
                    onChange={handleChange}
                    disabled={!editing}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expected Participants"
                    name="expectedParticipants"
                    type="number"
                    value={profile.expectedParticipants}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Website"
                    name="eventWebsite"
                    value={profile.eventWebsite}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                display="flex"
                alignItems="center"
              >
                <School sx={{ mr: 1 }} />
                College Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="College Name"
                    name="collegeName"
                    value={profile.collegeName}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="College Address"
                    name="collegeAddress"
                    value={profile.collegeAddress}
                    onChange={handleChange}
                    disabled={!editing}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="College Email"
                    name="collegeEmail"
                    value={profile.collegeEmail}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="College Phone"
                    name="collegePhone"
                    value={profile.collegePhone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Lightbulb sx={{ mr: 1 }} color="primary" />
            AI-Powered Event Suggestions
          </Box>
        </DialogTitle>
        <DialogContent>
          {generateSuggestions().map((section, index) => (
            <Box key={index} mb={3}>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              <List>
                {section.items.map((item, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <AutoAwesome color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
              {index < generateSuggestions().length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuggestionsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
