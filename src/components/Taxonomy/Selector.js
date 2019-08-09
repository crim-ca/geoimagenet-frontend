import {observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {UserInteractions} from "../../domain";
import {captureException} from "@sentry/browser";
import {CircularProgress, Tab, Tabs} from "@material-ui/core";

@observer
class Selector extends Component {
    static propTypes = {
        state_proxy: PropTypes.object.isRequired,
        user_interactions: PropTypes.instanceOf(UserInteractions).isRequired,
        t: PropTypes.func.isRequired,
    };

    state = {
        loading: true,
        value: 0,
    };

    constructor(props) {
        super(props);
        this.init();
    }

    async init() {
        const {user_interactions, state_proxy} = this.props;
        try {
            // dirtily select the first taxonomy in the list.
            await user_interactions.fetch_taxonomies();
            await user_interactions.select_taxonomy(state_proxy.taxonomies[0].versions[0], state_proxy.taxonomies[0].name);
        } catch (e) {
            captureException(e);
        }
        this.setState({loading: false});
    }

    /**
     * We use the positional id because the actual taxonomy id is hidden within the versions of the taxonomies, which is a bit more
     * of a hassle to use to select the right one than if it were flat.
     * It's probable that structure will change in the future, so basically selecting whatever taxonomy was built in the order
     * in which it was built if safer.
     * @param event
     * @param {number} taxonomy_positional_id the 0 indexed position of the taxonomy to be selected in the store's collection of taxonomies
     * @returns {Promise<void>}
     */
    handle_tab_select = async (event, taxonomy_positional_id) => {
        this.setState({value: taxonomy_positional_id});

        const {select_taxonomy} = this.props.user_interactions;
        const value = this.props.state_proxy.taxonomies[taxonomy_positional_id];

        const version = value['versions'][0];
        await select_taxonomy(version, value.name);
    };

    render() {

        // Building a tabs component without an actual value to pass in errors with material-ui.
        const {t, state_proxy: {taxonomies}} = this.props;
        if (this.state.loading) {
            return (
                <div style={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center'}}>
                    <CircularProgress/>
                </div>
            );
        }

        if (taxonomies.length === 0) {
            return <p>{t('intro:taxonomy.no_taxonomies')}</p>;
        }

        const {value} = this.state;
        return (
            <Tabs value={value} onChange={this.handle_tab_select}>
                {taxonomies.map((taxonomy, i) => <Tab value={i} key={i}
                                                      label={t(`taxonomy_classes:${taxonomy.versions[0].root_taxonomy_class_id}`)}/>)}
            </Tabs>
        );
    }
}

export {Selector};