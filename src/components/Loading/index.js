import React from 'react';
import FontAwesome from 'react-fontawesome';

const Loading = () =>
  <FontAwesome 
    name="circle-o-notch"
    spin
  />

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component { ...rest } />

export { Loading, withLoading };