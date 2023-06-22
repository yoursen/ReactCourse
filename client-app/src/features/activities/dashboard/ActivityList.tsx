import React from "react";
import { Activity } from "../../../app/modules/activity";
import { Button, Item, Label, Segment } from "semantic-ui-react";

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
}

export default function ActivityList({ activities,
    selectActivity, deleteActivity }: Props) {
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(a => (
                    <Item key={a.id}>
                        <Item.Content>
                            <Item.Header as='a'>{a.title}</Item.Header>
                            <Item.Meta>{a.date}</Item.Meta>
                            <Item.Description>
                                <div>{a.description}</div>
                                <div>{a.city}, {a.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={()=>selectActivity(a.id)} floated='right' color='blue'>View</Button>
                                <Button onClick={()=>deleteActivity(a.id)} floated='right' color='red'>Delete</Button>
                                <Label basic content={a.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
             ))}
            </Item.Group>
        </Segment>
    )
}