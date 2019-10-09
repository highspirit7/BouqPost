import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../containers/AppLayout';

const BouqPost = ({ Component }) => {
  return (
    <>
      <Head>
        <title>BouqPost</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css" />
      </Head>
      <AppLayout>
        <Component />
      </AppLayout>
    </>
  );
};

BouqPost.propTypes = {
  Component: PropTypes.elementType,
};

export default BouqPost;
