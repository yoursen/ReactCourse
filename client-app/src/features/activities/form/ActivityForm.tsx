import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import { Activity, ActivityFormValues } from "../../../app/modules/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { Formik, Form } from "formik";
import MyTextInput from "../../../app/common/form/MyTextInput";
import * as Yup from 'yup';
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues())

    const validationSchema = Yup.object({
        title: Yup.string().required('The field is missing'),
        category: Yup.string().required('The field is missing'),
        description: Yup.string().required('The field is missing'),
        date: Yup.string().required('The field is missing').nullable(),
        city: Yup.string().required('The field is missing'),
        venue: Yup.string().required('The field is missing'),
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, loadActivity])

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newactivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newactivity).then(() => navigate(`/activities/${activity.id}`));
        }
        else
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity' />

    return (
        <Segment clearing>
            <Header sub color="teal">Activity Details</Header>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={(values) => handleFormSubmit(values)}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <MyTextInput name='title' placeholder="Title" />
                            <MyTextArea placeholder='Description' name='description' rows={3} />
                            <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                            <MyDateInput placeholderText='Date' name='date'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />

                            <Header sub color="teal">Location detils</Header>
                            <MyTextInput placeholder='City' name='city' />
                            <MyTextInput placeholder='Venue' name='venue' />
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={isSubmitting} floated="right" positive type='submit' content='Submit' />
                            <Button as={Link} to='/activities' floated="right" type='button' content='Cancel' />
                        </Form>
                    )
                }
            </Formik>

        </Segment>
    )
})