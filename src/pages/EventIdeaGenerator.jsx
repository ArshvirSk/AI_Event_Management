import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { AutoAwesome as IdeaIcon } from "@mui/icons-material";
import { generateEventIdeasWithAI } from "../config/gemini";

const EventIdeaGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    theme: "",
    budget: [1000, 50000],
    attendees: [50, 500],
    eventType: "all",
    season: "any",
  });

  const eventTypes = [
    "all",
    "conference",
    "workshop",
    "hackathon",
    "cultural",
    "technical",
    "social",
    "corporate",
  ];

  const seasons = ["any", "spring", "summer", "fall", "winter"];

  const generateIdeas = async () => {
    if (!filters.theme && filters.eventType === "all" && filters.season === "any") {
      setError("Please provide at least one filter criteria");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedIdeas([]);

    try {
      const ideas = await generateEventIdeasWithAI(filters);
      if (ideas.length === 0) {
        setError("No ideas match your criteria. Try adjusting your filters.");
      } else {
        setGeneratedIdeas(ideas);
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      setError("Failed to generate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Event Idea Generator
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Theme or Keywords"
                value={filters.theme}
                onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
                placeholder="Enter themes or keywords for your event"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Budget Range ($)</Typography>
              <Slider
                value={filters.budget}
                onChange={(e, newValue) => setFilters({ ...filters, budget: newValue })}
                valueLabelDisplay="auto"
                min={1000}
                max={50000}
                step={1000}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Expected Attendees</Typography>
              <Slider
                value={filters.attendees}
                onChange={(e, newValue) => setFilters({ ...filters, attendees: newValue })}
                valueLabelDisplay="auto"
                min={50}
                max={500}
                step={50}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={filters.eventType}
                  label="Event Type"
                  onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Season</InputLabel>
                <Select
                  value={filters.season}
                  label="Season"
                  onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                >
                  {seasons.map((season) => (
                    <MenuItem key={season} value={season} sx={{ textTransform: "capitalize" }}>
                      {season}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={generateIdeas}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <IdeaIcon />}
                fullWidth
              >
                {loading ? "Generating Ideas..." : "Generate Event Ideas"}
              </Button>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {generatedIdeas.map((idea) => (
          <Grid item xs={12} md={6} key={idea.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {idea.title}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {idea.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {idea.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      sx={{ mr: 1, mb: 1 }}
                      size="small"
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Estimated Budget: ${idea.estimatedBudget.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Expected Attendees: {idea.expectedAttendees}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textTransform: "capitalize" }}>
                  Type: {idea.type}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textTransform: "capitalize" }}>
                  Best Season: {idea.season}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventIdeaGenerator;
