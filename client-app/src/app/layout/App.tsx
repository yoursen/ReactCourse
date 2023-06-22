import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Comment, Container } from 'semantic-ui-react';
import { Activity } from '../modules/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

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

  function handleCreateOrEditActivity(activity: Activity){
    activity.id 
    ? setActivites([...activities.filter(x=>x.id !== activity.id), activity])
    : setActivites([...activities, {...activity, id:uuid()}]);

    setEditMode(false);
    setSetelectedActivity(activity);
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
         closeForm={handleFormClose}
         createOrEdit={handleCreateOrEditActivity}/>
      </Container>

    </>
  );
}

export default App;
