import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { error } from "console";

export default observer(function LoginForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values).catch(error => setErrors({ error: 'Invalid login or password.' }))}>
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                    <Header as='h2' color='teal' textAlign="center">Login to Application</Header>
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <ErrorMessage name='error' render={() => <Label style={{ margin: 10 }} basic color='red'
                        content={errors.error} />} />
                    <Button positive content='Login' type='submit' />
                </Form>
            )}
        </Formik>
    )
})