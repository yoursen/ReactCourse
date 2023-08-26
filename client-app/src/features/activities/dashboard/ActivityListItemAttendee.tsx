import { observer } from 'mobx-react-lite'
import { Image, List, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/modules/profile'
import { Link } from 'react-router-dom';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {

    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }

    return (
        <List horizontal>
            {attendees.map(a => (
                <Popup hoverable key={a.userName}
                    trigger={
                        <List.Item key={a.userName} as={Link} to={`/profiles/${a.userName}`}>
                            <Image
                                size='mini'
                                circular
                                bordered
                                style={a.following ? styles : null}
                                src={a.image || '/assets/user.png'} />
                        </List.Item>
                    }>
                    <Popup.Content>
                        <ProfileCard profile={a} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    )
})