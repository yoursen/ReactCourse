import { observer } from "mobx-react-lite";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";


export default observer(function ActivityFilters() {
    const { activityStore: { predicate, setPredicate } } = useStore();
    return (<>
        <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
            <Header icon='filter' attached color='teal' content='Filters' />
            <Menu.Item
                active={predicate.has('all')}
                onClick={() => setPredicate('all', 'true')}
                content='All activities' />
            <Menu.Item
                active={predicate.has('isGoing')}
                onClick={() => setPredicate('isGoing', 'true')}
                content='I am going' />
            <Menu.Item
                active={predicate.has('isHost')}
                onClick={() => setPredicate('isHost', 'true')}
                content='I am hosting' />
        </Menu>
        <Header></Header>
        <Calendar
            onChange={(date) => setPredicate('startDate', date as Date)}
            value={predicate.get('startDate') || new Date()} />
    </>
    )
})