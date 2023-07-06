import React, { useEffect, useState } from 'react';
import { Comment, Container } from 'semantic-ui-react';
import { Activity } from '../modules/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const {activityStore} = useStore(); 
  const [activities, setActivites] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      activityStore.loadActivities();
    });
  }, [activityStore]);

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() =>{
      setActivites([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
    
  }

  if (activityStore.loadingInitial) return <LoadingComponent content='Loadin app' />

  return (
    <>
      <Comment>Use empty element is the same as Using the Fragment element.</Comment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activityStore.activities}
          deleteActivity={handleDeleteActivity}
          submitting={submitting} />
      </Container>

    </>
  );
}

export default observer(App);
