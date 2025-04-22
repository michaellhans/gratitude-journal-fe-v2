import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Chip,
  Rating,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { GratitudeEntry } from '../types/gratitude';
import { gratitudeApi } from '../services/api';

export const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entry, setEntry] = useState<GratitudeEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gratitudeApi.getEntryByDate(date);
      setEntry(data);
    } catch (error) {
      console.error('Error fetching entry:', error);
      setError('No entry found for this date');
      setEntry(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <IconButton
            onClick={() => navigateDate(-1)}
            disabled={loading}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{ textField: { variant: 'outlined' } }}
            />
          </LocalizationProvider>

          <IconButton
            onClick={() => navigateDate(1)}
            disabled={loading}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="textSecondary" align="center">
            {error}
          </Typography>
        ) : entry ? (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
              <Rating value={entry.dayRating} readOnly max={10} />
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">{entry.mainStory || 'No story recorded'}</Typography>
            </Paper>

            <Grid container spacing={2}>
              <Grid component="div" item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Gratitude List
                  </Typography>
                  <Typography variant="body2">
                    {entry.gratitudeList || 'No gratitude items recorded'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Learnings
                  </Typography>
                  <Typography variant="body2">
                    {entry.learnings || 'No learnings recorded'}
                  </Typography>
                </Box>
              </Grid>

              <Grid component="div" item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="error" gutterBottom>
                    Mistakes & Growth Opportunities
                  </Typography>
                  <Typography variant="body2">
                    {entry.mistakes || 'No mistakes recorded'}
                  </Typography>
                </Box>

                {entry.emotions?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Emotions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {entry.emotions.map((emotion: string) => (
                        <Chip key={emotion} label={emotion} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {entry.peopleInMind?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      People in Mind
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {entry.peopleInMind.map((person: string) => (
                        <Chip key={person} label={person} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>

            {(entry.goodHabits?.length > 0 || entry.badHabits?.length > 0) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Habits Tracker
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {entry.goodHabits?.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="success.main">Good Habits</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {entry.goodHabits.map((habit: string) => (
                          <Chip key={habit} label={habit} size="small" color="success" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {entry.badHabits?.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="error">Habits to Improve</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {entry.badHabits.map((habit: string) => (
                          <Chip key={habit} label={habit} size="small" color="error" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        ) : null}
      </Paper>
    </Container>
  );
}; 