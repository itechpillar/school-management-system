import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SchoolProfile, BasicSchoolInfo } from '../../types/school';
import { BasicInfoForm, LocationForm, ContactForm } from './schoolProfile';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`school-tabpanel-${index}`}
      aria-labelledby={`school-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SchoolProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [schoolProfile, setSchoolProfile] = useState<Partial<SchoolProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchoolProfile();
  }, []);

  const fetchSchoolProfile = async () => {
    try {
      const schoolDoc = await getDoc(doc(db, 'schools', 'primary'));
      if (schoolDoc.exists()) {
        setSchoolProfile(schoolDoc.data() as SchoolProfile);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch school profile');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'schools', 'primary'), {
        ...schoolProfile,
        updatedAt: new Date().toISOString()
      });
      setSaving(false);
    } catch (err) {
      setError('Failed to save school profile');
      setSaving(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBasicInfoChange = (basicInfo: BasicSchoolInfo) => {
    setSchoolProfile(prev => ({ ...prev, basicInfo }));
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">School Profile Management</Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            Save All Changes
            {saving && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="school profile tabs"
          >
            <Tab label="Basic Information" />
            <Tab label="Location" />
            <Tab label="Contact" />
            <Tab label="Management" />
            <Tab label="Affiliation" />
            <Tab label="Facilities" />
            <Tab label="Infrastructure" />
            <Tab label="Academic" />
            <Tab label="Fee Structure" />
            <Tab label="Policies" />
            <Tab label="Timings" />
            <Tab label="Health & Safety" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <BasicInfoForm
            data={schoolProfile.basicInfo}
            onChange={handleBasicInfoChange}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <LocationForm
            data={schoolProfile.location}
            onChange={(location) => setSchoolProfile(prev => ({ ...prev, location }))}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ContactForm
            data={schoolProfile.contact}
            onChange={(contact) => setSchoolProfile(prev => ({ ...prev, contact }))}
          />
        </TabPanel>

        {/* Add other TabPanels here */}
      </Paper>
    </Container>
  );
};

export default SchoolProfileManagement;