import React from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { useTracker } from '../hooks';
import { commafy, friendlyDate } from '../lib/util';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
import { stateLocations } from '../data/state-locations';

const LOCATION = {
  lat: 38,
  lng: -96,
};

const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 4;

const USPage = () => {

  const { data: stateStats = [] } = useTracker({
    api: 'states'
  });

  const { data: stats = [] } = useTracker({
    api: 'united-states'
  });

  const hasStates = Array.isArray(stateStats) && stateStats.length > 0;

  const dashboardStats = [
    {
      primary: {
        label: 'Total Cases',
        value: stats ? commafy(stats?.cases) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.casesPerOneMillion
      }
    },
    {
      primary: {
        label: 'Total Deaths',
        value: stats ? commafy(stats?.deaths) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.deathsPerOneMillion
      }
    },
    {
      primary: {
        label: 'Total Tests',
        value: stats ? commafy(stats?.tests) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.testsPerOneMillion
      }
    },
    {
      primary: {
        label: 'Recovered',
        value: stats ? commafy(stats?.recovered) : '-'
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.recoveredPerOneMillion
      }
    },
    {
      primary: {
        label: 'Cases Today',
        value: stats ? commafy(stats?.todayCases) : '-'
      }
    },
    {
      primary: {
        label: 'Deaths Today',
        value: stats ? commafy(stats?.todayDeaths) : '-'
      }
    }
  ]

  async function mapEffect({ leafletElement: map } = {}) {
    if (!hasStates) return;

    const stateInfoArray = stateStats.map(item => {
      let locationFound = stateLocations.filter(loc => { return loc.state === item.state })
      if (locationFound.length) {
        item.lat = locationFound[0].latitude;
        item.lng = locationFound[0].longitude;
        return item
      }
    }).filter(item => item != undefined);
    console.log(stateInfoArray);

    const geoJson = {
      type: 'FeatureCollection',
      features: stateInfoArray.map((stateInstance = {}) => {
        const { lat, lng } = stateInstance;
        return {
          type: 'Feature',
          properties: {
            ...stateInstance
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          state,
          updated,
          cases,
          deaths
        } = properties

        casesString = `${cases}`;

        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${state}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString}
          </span>
        `;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });

    geoJsonLayers.addTo(map)
  };


  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <div className="tracker">
        <Map {...mapSettings} />
        <div className="tracker-stats">
          <ul>
            {dashboardStats.map(({ primary = {}, secondary = {} }, i) => {
              return (
                <li key={`Stat-${i}`} className="tracker-stat">
                  {primary.value && (
                    <p className="tracker-stat-primary">
                      {primary.value}
                      <strong>{primary.label}</strong>
                    </p>
                  )}
                  {secondary.value && (
                    <p className="tracker-stat-secondary">
                      {secondary.value}
                      <strong>{secondary.label}</strong>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tracker-last-updated">
          <p>
            Last Updated: {stats ? friendlyDate(stats?.updated) : '-'}
          </p>
        </div>
      </div>

      <Container type="content" className="text-center home-start">
      </Container>
    </Layout>
  );
};

export default USPage;
