// @flow strict

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils';
import { TextField, Button, Select, MenuItem, Typography, FormControl, InputLabel } from "@material-ui/core";
import { withDataQueries, withUserInterfaceStore } from "../../model/HOCs";
import { compose } from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";

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
  const { dataQueries, uiStore, classes } = props;
  const { t } = useTranslation();

  const [email_string, set_email_string] = useState("");
  const [disabled, set_disabled] = useState(true);
  const [selected_group, set_selected_group] = useState("users");

  useEffect(() => {
    const has_content = email_string.length > 0;
    if (has_content) {
      set_disabled(false);
    } else {
      set_disabled(true);
    }
  });

  const email_string_handler = event => {
    set_email_string(event.target.value);
  };

  const selected_group_handler = event => {
    set_selected_group(event.target.value);
  };

  const create_account = async email => {
    email = email.trim();
    const user_name = strip_unwanted_name_chars(email.split("@")[0]);
    // TODO magpie 2.0 will enforce an at least 12 characters policy so put 12 in env vars
    const password = make_pseudorandom_password(12);
    try {
      const response = await dataQueries.create_user(user_name, email, password, selected_group);
      if (response.statusCode === 201) {
        return `success: created user identified by [${user_name}] for email [${email}] with password ${password}\n`;
      } else {
        return `failure: problem within magpie when creating user ${email}\n`;
      }
    } catch (e) {
      return `failure: http request problem for user ${email}\n`;
    }
  };

  const create_users = async () => {
    const emails = email_string.split(",");
    const promises = emails.map(create_account);
    const logs = await Promise.all(promises);
    set_email_string(logs.join(""));
  };

  return (
    <section className={classes.form}>

      <Typography variant="h5">{t("settings:batch_user_creation")}</Typography>
      <Typography variant="body1">{t("settings:batch_user_creation_instructions")}</Typography>

      <TextField
        variant="outlined"
        placeholder={t("settings:batch_user_creation_placeholder")}
        value={email_string}
        onChange={email_string_handler}
        rows={6}
        multiline
        fullWidth />

      <Typography variant="body2">{t("settings:batch_user_creation_group_choice")}</Typography>

      <Select
        variant="outlined"
        value={selected_group} onChange={selected_group_handler}>
        {uiStore.availableGroups.map((group, i) => (
          <MenuItem value={group} key={i}>{group}</MenuItem>
        ))}
      </Select>

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
  withUserInterfaceStore,
  withStyles(theme => ({
    form: {
      display: "grid",
      gridTemplateColumn: "1fr",
      gridGap: theme.values.gutterSmall,
    }
  })),
)(BatchUserCreationForm);


export { component as BatchUserCreationForm };
