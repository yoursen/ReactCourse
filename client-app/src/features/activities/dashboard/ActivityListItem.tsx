import { observer } from "mobx-react-lite";
import { Button, Icon, Item, Segment, SegmentGroup } from "semantic-ui-react";
import { Activity } from "../../../app/modules/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Props {
    activity: Activity
}

export default observer(function ({ activity }: Props) {
    return (
        <SegmentGroup>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>{activity.description}</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock'/>{format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name="marker"/>{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link} to={`/activities/${activity.id}`}
                    color="teal"
                    floated="right"
                    content='View'
                />
            </Segment>
        </SegmentGroup>
    )
})