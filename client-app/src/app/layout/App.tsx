import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg'
import axios from 'axios';
import { Button, Comment, Container, Header, List, ListItem } from 'semantic-ui-react';
import { Activity } from '../modules/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {

  const [activities, setActivites] = useState<Activity[]>([]);
  const [selectedActivity, setSetelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(response => {
        console.log(response);
        setActivites(response.data);
      });
  }, []);

  function handleSelectActivity(id: string) {
    setSetelectedActivity(activities.find(a => a.id === id));
  }

  function handleCancelSelectActivity() {
    setSetelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  return (
    <>
      <Comment>Use empty element is the same as Using the Fragment element.</Comment>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
         selectedActivity={selectedActivity}
         selectActivity={handleSelectActivity}
         cancelSelectedActivity={handleCancelSelectActivity}
         editMode={editMode} 
         openForm={handleFormOpen}
         closeForm={handleFormClose}/>
      </Container>

    </>
  );
}

export default App;
