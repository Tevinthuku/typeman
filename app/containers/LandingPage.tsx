import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <Typography>
        Boost your productivity Type Driven development productivity
      </Typography>
      <Button component={Link} to="/workspace">
        Go to Workspace
      </Button>
    </div>
  );
}
