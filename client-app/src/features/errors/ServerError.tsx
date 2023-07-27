import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Container, Header, Segment } from "semantic-ui-react";

export default observer (function ServerError(){
    const {commonStore} = useStore();

    return (<Container>
        <Header as='h1'>Server Error</Header>
        <Header sub as='h5' color="red">{commonStore.error?.message}</Header>
        {commonStore.error?.details && (
            <Segment>
                <Header as='h4' color="teal">Stack Trace</Header>
                <code style={{marginTop: 10}}>{commonStore.error.details}</code>
            </Segment>
        )}
    </Container>)
})