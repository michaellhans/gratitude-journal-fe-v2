import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  Grid,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Box,
  Rating,
  Chip,
  Divider,
} from '@mui/material';
import { GratitudeEntry } from '../types/gratitude';
import { gratitudeApi } from '../services/api';

export const GratitudeList: React.FC = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const data = await gratitudeApi.getAllEntries();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch gratitude entries');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Gratitude Journal
        </Typography>
        {entries.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Your Gratitude Journey Starts Here
            </Typography>
            <Typography color="textSecondary">
              Take a moment to reflect and create your first gratitude entry.
            </Typography>
          </Box>
        ) : (
          <List>
            {entries.map((entry) => (
              <React.Fragment key={entry._id}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
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
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};