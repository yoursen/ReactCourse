import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button, ButtonGroup } from "semantic-ui-react";
import { Photo, Profile } from "../../app/modules/profile";
import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
    profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
    const { profileStore } = useStore();
    const { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deleting, deletePhoto } = profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function HandlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function setMainPhotoHandler(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function deletePhotoHandler(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='image' content='Photos' floated="left" />
                    {isCurrentUser && (
                        <Button floated="right" basic
                            content={addPhotoMode ? 'Cancel' : 'AddPhoto'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)} />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (<PhotoUploadWidget uploadPhoto={HandlePhotoUpload} uploading={uploading} />) : (
                        <Card.Group>
                            {profile.photos?.map(p => (
                                <Card key={p.id}>
                                    <Image src={p.url} />
                                    {isCurrentUser &&
                                        <ButtonGroup fluid widths={2}>
                                            <Button
                                                basic
                                                color="green"
                                                content='Main'
                                                name={p.id}
                                                disabled={p.isMain}
                                                loading={target === p.id && loading}
                                                onClick={e => setMainPhotoHandler(p, e)} />

                                            <Button
                                                basic
                                                color="red"
                                                icon='trash'
                                                name={p.id}
                                                disabled={p.isMain}
                                                loading={target === p.id && deleting}
                                                onClick={e => deletePhotoHandler(p, e)} />
                                        </ButtonGroup>}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>)
})