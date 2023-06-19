import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg'
import axios from 'axios';
import { Button, Comment, Container, Header, List, ListItem } from 'semantic-ui-react';
import { Activity } from '../modules/activity';
import NavBar from './NavBar';

function App() {

  const [activities, setActivites] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(response => {
        console.log(response);
        setActivites(response.data);
      });
  }, []);

  return (
    <> 
      <Comment>Use empty element is the same as Using the Fragment element.</Comment>
      <NavBar />
      <Container style={{marginTop:'7em'}}>
        <List>
          {activities.map((a: Activity) => (
            <ListItem key={a.id}>{a.title}</ListItem>
          ))}
        </List>
      </Container>

    </>
  );
}

export default App;
