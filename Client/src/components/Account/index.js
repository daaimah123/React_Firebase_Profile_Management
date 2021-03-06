import React from 'react';
import SearchAvailabilityLink from '../SearchAvailability/SeachAvailabilityLink';
import { PasswordForgetForm } from '../PasswordForget/index.js';
import PasswordChangeForm from '../PasswordChange';
import {AuthUserContext, withAuthorization} from '../Session';

//TODO: can remove, not being used

const Account = () => (
  <div>
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Welcome back to your account {authUser.email}!</h1>
                <PasswordForgetForm /> 
                <PasswordChangeForm />
                <SearchAvailabilityLink />
            </div>
        )}
    </AuthUserContext.Consumer>
  </div>
  
);

const condition = authUser => authUser != null;

export default withAuthorization(condition)(Account);