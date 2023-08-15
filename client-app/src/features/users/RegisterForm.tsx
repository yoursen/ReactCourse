import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { error } from "console";
import * as Yup from 'yup'
import ValidationError from "../errors/ValidationError";

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ displayName: '', userName: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => setErrors({ error: error }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                userName: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
            })}
        >

            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete="off">
                    <Header as='h2' color='teal' textAlign="center">Sign Up to Application</Header>
                    <MyTextInput placeholder='Display Name' name='displayName' />
                    <MyTextInput placeholder='User Name' name='userName' />
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <ErrorMessage name='error' render={() =>
                        <ValidationError errors={errors.error} />
                    } />
                    <Button
                        positive
                        disabled={!isValid || !dirty || isSubmitting}
                        content='Register'
                        type='submit' />
                </Form>
            )}
        </Formik>
    )
})