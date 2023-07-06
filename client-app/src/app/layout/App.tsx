import React, { Fragment, useEffect, useState } from 'react';
import { Comment, Container } from 'semantic-ui-react';
import { Activity } from '../modules/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const [activities, setActivites] = useState<Activity[]>([]);
  const [selectedActivity, setSetelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(a => {
        a.date = a.date.split('T')[0];
        activities.push(a);
      });
      setActivites(activities);
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSetelectedActivity(activities.find(a => a.id === id));
  }

  function handleCancelSelectActivity() {
    setSetelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivites([...activities.filter(x => x.id !== activity.id), activity]);
        setEditMode(false);
        setSetelectedActivity(activity);
        setSubmitting(false);
      });
    }else{
      activity.id=uuid();
      agent.Activities.create(activity).then(()=>{
        setActivites([...activities, activity]);
        setEditMode(false);
        setSetelectedActivity(activity);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() =>{
      setActivites([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingComponent content='Loadin app' />

  return (
    <>
      <Comment>Use empty element is the same as Using the Fragment element.</Comment>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectedActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting} />
      </Container>

    </>
  );
}

export default App;
