import React from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { useTracker } from '../hooks';
import { commafy, friendlyDate } from '../lib/util';

import Layout from 'components/Layout';
import Container from 'components/Container';


const USPage = () => {

    const { data: stateStats = [] } = useTracker({
        api: 'states'
    });
    const hasStates = Array.isArray(stateStats) && stateStats.length > 0;
    console.log(stateStats);
    console.log(hasStates);

    if (!hasStates) return (

        <Layout pageName="home">
            <Helmet>
                <title>US Stats Page</title>
            </Helmet>

            <div className="tracker">
                <div className="tracker-stats">
                    <p>Loading...</p>
                </div>
            </div>

            <Container type="content" className="text-center home-start">
            </Container>
        </Layout>
    )

    return (
        <Layout pageName="home">
            <Helmet>
                <title>US Stats Page</title>
            </Helmet>

            <div className="tracker">
                <div className="tracker-stats">
                    <ul>
                        {stateStats.map((stateInfo, i) => {
                            return (
                                <li key={`Stat-${i}`} className="tracker-stat">
                                    {stateInfo.state && (
                                        <div>
                                            <p className="tracker-stat-primary">
                                                {stateInfo.state}
                                                <strong>Total Cases</strong>
                                            </p>
                                            <p className="tracker-stat-secondary">
                                                {commafy(stateInfo.cases)}
                                            </p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="tracker-last-updated">
                    <p>
                    </p>
                </div>
            </div>

            <Container type="content" className="text-center home-start">
            </Container>
        </Layout>
    );
};

export default USPage;
