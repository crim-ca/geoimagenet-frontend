// @flow strict

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../utils';
import { TextField, withStyles, Button } from "@material-ui/core";
import { NotificationManager } from 'react-notifications';

import type { DataQueries } from '../../domain/data-queries';

const SettingsComponent = (props) => {
  const { classes: { form }, data_queries } = props;
  const { t } = useTranslation();

  const [new_password, set_new_password] = useState("");
  const [confirm_password, set_confirm_password] = useState("");
  const [disabled, set_disabled] = useState(false);

  const make_set_value_callback = (set_function) => (event) => {
    const value = event.target.value;
    set_function(value);
  };

  const submit_password_change_request = async () => {
    let response;
    try {
      response = await data_queries.change_password_request(new_password);
    } catch (error) {
      NotificationManager.error(t('settings:change_password_failure'));
    }
    if (response.statusCode === 200) {
      NotificationManager.success(t('settings:change_password_success'));
      set_new_password("");
      set_confirm_password("");
    } else {
      NotificationManager.error(t('settings:change_password_failure'));
    }
  };

  useEffect(() => {
    const is_valid_password = new_password.length > 11 && confirm_password.length > 11 && new_password === confirm_password;
    set_disabled(!is_valid_password);
  });

  return (
    <section className={form}>
      <h2>{t('settings:change_password')}</h2>
      <p>{t('settings:min_password_length_info')}</p>
      <TextField
        value={new_password}
        type='password'
        placeholder={t('settings:new_password')}
        onChange={make_set_value_callback(set_new_password)} />
      <TextField
        value={confirm_password}
        type='password'
        placeholder={t('settings:confirm_new_password')}
        onChange={make_set_value_callback(set_confirm_password)} />
      <Button disabled={disabled} variant="contained" color="primary" onClick={submit_password_change_request}>
        {t('settings:submit_new_password_request')}
      </Button>
    </section>
  );
};

SettingsComponent.propTpes = {
  classes: PropTypes.object.isRequired,
  // yada yada not the same way to consider types as with classes, yada yada comment for now
  //data_queries: DataQueries,
};

const styled = withStyles({
  form: {
    display: 'flex',
    flexDirection: 'column'
  }
})(SettingsComponent);

export { styled as ChangePasswordForm };
