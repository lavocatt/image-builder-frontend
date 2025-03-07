import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Popover,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { DownloadIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { resolveRelPath } from '../../Utilities/path';

const ImageLinkDirect = ({ uploadStatus, ...props }) => {
  const navigate = useNavigate();
  const fileExtensions = {
    vsphere: '.vmdk',
    'guest-image': '.qcow2',
    'image-installer': '.iso',
  };

  if (uploadStatus.type === 'aws') {
    const url =
      'https://console.aws.amazon.com/ec2/v2/home?region=' +
      uploadStatus.options.region +
      '#LaunchInstanceWizard:ami=' +
      uploadStatus.options.ami;
    return (
      <Button
        component="a"
        target="_blank"
        variant="link"
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        isInline
        href={url}
      >
        Launch instance
      </Button>
    );
  } else if (uploadStatus.type === 'azure') {
    const url =
      'https://portal.azure.com/#@' +
      props.uploadOptions.tenant_id +
      '/resource/subscriptions/' +
      props.uploadOptions.subscription_id +
      '/resourceGroups/' +
      props.uploadOptions.resource_group +
      '/providers/Microsoft.Compute/images/' +
      uploadStatus.options.image_name;
    return (
      <Button
        component="a"
        target="_blank"
        variant="link"
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        isInline
        href={url}
      >
        View uploaded image
      </Button>
    );
  } else if (uploadStatus.type === 'gcp') {
    return (
      <Popover
        aria-label="Popover with google cloud platform image details"
        maxWidth="30rem"
        headerContent={'GCP image details'}
        bodyContent={
          <TextContent>
            <Text component={TextVariants.p}>
              To use an Image Builder created Google Cloud Platform (GCP) image
              in your project, specify the project ID and image name in your
              templates and configurations.
            </Text>
            <Text>
              <strong>Project ID</strong>
              <br />
              {uploadStatus.options.project_id}
            </Text>
            <Text>
              <strong>Image Name</strong>
              <br />
              {uploadStatus.options.image_name}
            </Text>
            <Text>
              <strong>Shared with</strong>
              <br />
              {/* the account the image is shared with is stored in the form type:account so this extracts the account */}
              {props.uploadOptions.share_with_accounts[0].split(':')[1]}
            </Text>
          </TextContent>
        }
      >
        <Button component="a" target="_blank" variant="link" isInline>
          Image details
        </Button>
      </Popover>
    );
  } else if (uploadStatus.type === 'aws.s3') {
    if (!props.isExpired) {
      return (
        <Button
          component="a"
          target="_blank"
          variant="link"
          icon={<DownloadIcon />}
          iconPosition="right"
          isInline
          href={uploadStatus.options.url}
        >
          Download {fileExtensions[props.imageType]}
        </Button>
      );
    } else {
      return (
        <Button
          component="a"
          target="_blank"
          variant="link"
          onClick={() =>
            navigate(resolveRelPath('/imagewizard'), {
              state: {
                composeRequest: props.recreateImage,
                initialStep: 'review',
              },
            })
          }
          isInline
        >
          Recreate image
        </Button>
      );
    }
  }

  return null;
};

ImageLinkDirect.propTypes = {
  uploadStatus: PropTypes.object,
  imageType: PropTypes.string,
  isExpired: PropTypes.bool,
  recreateImage: PropTypes.object,
  uploadOptions: PropTypes.object,
};

export default ImageLinkDirect;
