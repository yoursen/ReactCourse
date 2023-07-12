import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

export default observer( function ActivityList() {
    const [target, setTarget] = useState('');
    const { activityStore } = useStore();
    const {activities, loading} = activityStore;

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        activityStore.deleteActivity(id);
    }
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
                                <Button as={Link} to={`/activities/${a.id}`} floated='right' color='blue'>View</Button>
                                <Button
                                    name={a.id}
                                    loading={loading && target === a.id}
                                    onClick={(e) => handleActivityDelete(e, a.id)}
                                    floated='right' color='red'>Delete</Button>
                                <Label basic content={a.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})