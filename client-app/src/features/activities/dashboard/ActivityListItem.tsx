import { observer } from "mobx-react-lite";
import { Button, Icon, Item, Label, Segment, SegmentGroup } from "semantic-ui-react";
import { Activity } from "../../../app/modules/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity
}

export default observer(function ({ activity }: Props) {
    return (
        <SegmentGroup>
            <Segment>
                {activity.isCancelled &&
                    <Label
                        color="red"
                        attached="top"
                        content='Cancelled'
                        style={{ textAlign: 'center' }} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={activity.host?.image || '/assets/user.png'}
                            style={{ marginBottom: 3 }} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by <Link to={`/profiles/${activity.hostUserName}`}>{activity.host?.displayName}</Link></Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'>You're hosting this activity</Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color='green'>You're going this activity</Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' />{format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name="marker" />{activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
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