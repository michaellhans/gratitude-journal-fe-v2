import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { gratitudeApi, generalValuesApi } from '../services/api';
import { CreateGratitudeEntryDto } from '../types/gratitude';
import { GeneralValues } from '../types/generalValues';
import { useNavigate } from 'react-router-dom';

export const CreateGratitudeEntry: React.FC = () =>  {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateGratitudeEntryDto>({
    date: new Date().toISOString().split('T')[0],
    mainStory: '',
    dayRating: 5,
    emotions: [],
    learnings: '',
    gratitudeList: '',
    mistakes: '',
    peopleInMind: [],
    goodHabits: [],
    badHabits: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalValues, setGeneralValues] = useState<{
    emotions: string[];
    goodHabits: string[];
    badHabits: string[];
  }>({
    emotions: [],
    goodHabits: [],
    badHabits: []
  });

  useEffect(() => {
    const fetchGeneralValues = async () => {
      try {
        const values = await generalValuesApi.getGeneralValues();
        const emotions = values.find((v: GeneralValues) => v.category === 'emotions')?.values || [];
        const goodHabits = values.find((v: GeneralValues) => v.category === 'goodHabits')?.values || [];
        const badHabits = values.find((v: GeneralValues) => v.category === 'badHabits')?.values || [];
        setGeneralValues({ emotions, goodHabits, badHabits });
      } catch (error) {
        console.error('Error fetching general values:', error);
      }
    };
    fetchGeneralValues();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await gratitudeApi.createEntry(formData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mainStory: '',
        dayRating: 5,
        emotions: [],
        learnings: '',
        gratitudeList: '',
        mistakes: '',
        peopleInMind: [],
        goodHabits: [],
        badHabits: [],
      });
      navigate('/home');
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateGratitudeEntryDto) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleMultipleSelectChange = (field: 'emotions' | 'goodHabits' | 'badHabits') => (
    event: SelectChangeEvent<string[]>
  ) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleArrayInputChange = (field: 'peopleInMind') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value.split(',').map((item) => item.trim()),
    }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Gratitude Entry
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={formData.date}
            onChange={handleChange('date')}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Main Story"
            multiline
            minRows={4}
            value={formData.mainStory}
            onChange={handleChange('mainStory')}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Day Rating</Typography>
            <Rating
              value={formData.dayRating}
              onChange={(_, value) => setFormData((prev) => ({ ...prev, dayRating: value || 5 }))}
              max={10}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Emotions</InputLabel>
            <Select
              multiple
              value={formData.emotions}
              onChange={handleMultipleSelectChange('emotions')}
              input={<OutlinedInput label="Emotions" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {generalValues.emotions.map((emotion) => (
                <MenuItem key={emotion} value={emotion}>
                  <Checkbox checked={formData.emotions.indexOf(emotion) > -1} />
                  <ListItemText primary={emotion} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Learnings"
            multiline
            minRows={2}
            value={formData.learnings}
            onChange={handleChange('learnings')}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Gratitude List"
            multiline
            minRows={3}
            value={formData.gratitudeList}
            onChange={handleChange('gratitudeList')}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Mistakes"
            multiline
            minRows={2}
            value={formData.mistakes}
            onChange={handleChange('mistakes')}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="People in Mind (comma-separated)"
            value={formData.peopleInMind.join(', ')}
            onChange={handleArrayInputChange('peopleInMind')}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Good Habits</InputLabel>
            <Select
              multiple
              value={formData.goodHabits}
              onChange={handleMultipleSelectChange('goodHabits')}
              input={<OutlinedInput label="Good Habits" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {generalValues.goodHabits.map((habit) => (
                <MenuItem key={habit} value={habit}>
                  <Checkbox checked={formData.goodHabits.indexOf(habit) > -1} />
                  <ListItemText primary={habit} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Bad Habits</InputLabel>
            <Select
              multiple
              value={formData.badHabits}
              onChange={handleMultipleSelectChange('badHabits')}
              input={<OutlinedInput label="Bad Habits" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {generalValues.badHabits.map((habit) => (
                <MenuItem key={habit} value={habit}>
                  <Checkbox checked={formData.badHabits.indexOf(habit) > -1} />
                  <ListItemText primary={habit} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Entry'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};