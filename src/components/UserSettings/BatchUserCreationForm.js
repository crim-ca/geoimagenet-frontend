// @flow strict

import React, { useState, useEffect } from 'react';
import { useTranslation, withTranslation } from '../../utils';
import { NotificationManager } from 'react-notifications';
import { TextField, withStyles, Button } from "@material-ui/core";
import type { DataQueries } from "../../domain/data-queries";
import { withDataQueries } from "../../model/HOCs";
import { compose } from "react-apollo";

/**
 *
 * here we will be generating a pseudorandom password to be given to the new accounts recipients
 * IMPORTANT this is NOT random, cryptographically safe, or in any way or intent a good way to generate passwords
 * these passwords are intended to be given out to the user accounts recipients and then changed
 * pretty much copied from https://stackoverflow.com/a/1497512
 *
 * @param length
 */
const make_pseudorandom_password = (length: number) => {
  if (length < 1) {
    throw new Error("a smaller length than 1 does not make sense (and actually it should be like at least 10)");
  }

  // we will be picking characters within these possibilities
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@/$%?&*()[]{}<>`;:";
  let password = "";
  for (let i = 0; i < length; i++) {
    const position = Math.floor(Math.random() * charset.length);
    password += charset.charAt(position);
  }
  return password;
};

/**
 *
 * magpie usernames must not have characters that van break urls since they are used in urls
 * such as /users/bob
 *
 * we will be doing like https://stackoverflow.com/a/37511463
 *
 * @param email
 * @returns {string}
 */
const strip_unwanted_name_chars = (email: string): string => {
  email = email.normalize("NFD");
  email = email.replace(/[\u0300-\u036f]/g, "");
 return email;
};

const BatchUserCreationForm = (props) => {
  const { dataQueries } = props;
  const { t } = useTranslation();

  const [email_string, set_email_string] = useState("");
  const [disabled, set_disabled] = useState(true);

  useEffect(() => {
    const has_content = email_string.length > 0;
    if (has_content) {
      set_disabled(false);
    } else {
      set_disabled(true);
    }
  });

  const change_handler = event => {
    set_email_string(event.target.value);
  };

  const create_users = async () => {
    const emails = email_string.split(",");
    let log = "";
    const promises = emails.map(async email => {
      email = email.trim();
      const user_name = strip_unwanted_name_chars(email.split("@")[0]);
      console.log("user name:", user_name);
      const password = make_pseudorandom_password(12);
      console.log("password:", password);
      try {
        const response = await dataQueries.create_user(user_name, email, password, "users");
        if (response.statusCode === 201) {
          log += `success: created user identified by [${user_name}] for email [${email}] with password ${password}\n`;
        } else {
          log += `failure: problem within magpie when creating user ${email}\n`;
        }
      } catch (e) {
        log += `failure: http request problem for user ${email} creation\n`;
      }
    });
    await Promise.all(promises);
    set_email_string(log);
  };

  return (
    <section>
      <h2>{t("settings:batch_user_creation")}</h2>
      <p>{t("settings:batch_user_creation_instructions")}</p>
      <TextField
        value={email_string}
        onChange={change_handler}
        placeholder={t("settings:batch_user_creation_placeholder")}
        rows={6}
        multiline
        fullWidth />
      <Button
        disabled={disabled}
        variant="contained"
        color="primary"
        onClick={create_users}>
        {t("settings:batch_user_creation_submit")}
      </Button>
    </section>
  );
};

const component = compose(
  withDataQueries,
)(BatchUserCreationForm);


export { component as BatchUserCreationForm };
