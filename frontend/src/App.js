import React, { useEffect } from 'react';
import { NativeRouter as Router, Routes, Route, Navigate } from 'react-router-native';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import { ServiceProvider } from './contexts/ServiceContext';
import Login from './components/Login';
import Home from './components/Home';
import Meetings from './components/Meetings';
import MeetingDetail from './components/MeetingDetail';
import LessonPlan from './components/LessonPlan';
import Comments from './components/Comments';
import Settings from './components/Settings';
import UserProfileDetail from './components/UserProfileDetail';
import Services from './components/Services';
import Identifications from './components/Identifications';
import Chats from './components/Chats';
import Activity from './components/Activity';
import PLCChat from './components/PLCChat';
import Layout from './components/Layout';


function AppContent() {
  const { isAuthenticated, currentUser } = useAuth();
  const { theme } = useTheme();

  // Alert teacher if class is missing
  useEffect(() => {
    if (isAuthenticated && currentUser && !currentUser.class) {
      const msg = "Your profile is missing a class assignment. Please update your profile in Settings to ensure full functionality.";
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert("Profile Incomplete", msg);
      }
    }
  }, [isAuthenticated, currentUser]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Layout>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/meetings" element={<PLCChat />} />
              <Route path="/meetings/:id" element={<MeetingDetail />} />
              <Route path="/lesson-plan" element={<PLCChat />} />

              <Route path="/comments" element={<Comments />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/profile" element={<UserProfileDetail />} />
              <Route path="/settings/services" element={<Services />} />
              <Route path="/settings/identifications" element={<Identifications />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}

export default App;
