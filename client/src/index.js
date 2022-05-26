import React from 'react';
import { createRoot } from 'react-dom/client';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { App } from './App';

const client = new ApolloClient({ uri: '/graphql' });

const ApolloApp = (AppComponent) => (
  <ApolloProvider client={client}>
    <AppComponent />
  </ApolloProvider>
);

const root = createRoot(document.getElementById('root'));

root.render(ApolloApp(App))