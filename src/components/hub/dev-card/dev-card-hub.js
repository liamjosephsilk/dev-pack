/** @jsx jsx */
import { jsx } from 'theme-ui';
import React from 'react';
import { TabPanel } from 'react-tabs';
import ProfileCard from './profile-card';
import Input from '../../home/signup/input';
import TextArea from '../../common/textarea';
import Label from '../../home/signup/label';
import Checkbox from './../../home/social-checkboxes/checkbox';
import { gql, useMutation, useQuery } from '@apollo/client';
import Logout from '../logout';
import Button from '../../common/button';
import Emoji from '../../common/emoji';
import LabelText from './../../common/label-text';
import { UserContext } from './../../../context/user-context';
import TwitterLogin from '../../auth/twitter-login';
import DevToLogin from './../../auth/dev-to-login';
import CodePenLogin from './../../auth/codepen-login';
import LinkedInLogin from './../../auth/linkedIn-login';
import gsap from 'gsap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UPDATE_TWITTER_USER = gql`
  mutation UpdateTwitterProfile($query: [[String!]!]) {
    twitter {
      makeRestCall {
        post(path: "/1.1/account/update_profile.json", query: $query) {
          jsonBody
          response {
            statusCode
          }
        }
      }
    }
  }
`;

const UPDATE_GITHUB_USER = gql`
  mutation UpdateGitHubUserProfile($email: String, $bio: String, $location: String, $name: String) {
    gitHub {
      updateAuthenticatedUser_oneGraph(input: { name: $name, location: $location, email: $email, description: $bio }) {
        updatedUser {
          bio
          name
          email
          location
        }
      }
    }
  }
`;

const GET_PROFILE_INFO = gql`
  query GetTwitterGithubProfileQuery {
    me {
      twitter {
        name
        description
        location
        screenName
      }
      github {
        email
        websiteUrl
      }
    }
  }
`;

toast.configure();

const DevCardHub = ({ user, ...rest }) => {
  const [github, { data: githubData }] = useMutation(UPDATE_GITHUB_USER);
  const [twitter, { data: twitterData }] = useMutation(UPDATE_TWITTER_USER);
  const { loading, error, data: userData } = useQuery(GET_PROFILE_INFO);
  const { currentUser } = React.useContext(UserContext);

  const [name, setName] = React.useState(currentUser.displayName !== '' ? currentUser.displayName : '');
  const [email, setEmail] = React.useState(currentUser.email !== '' ? currentUser.email : '');
  const [location, setLocation] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [website, setWebsite] = React.useState(currentUser.websiteUrl !== '' ? currentUser.websiteUrl : '');
  const [checkboxGithub, setCheckboxGithub] = React.useState(false);
  const [checkboxTwitter, setCheckboxTwitter] = React.useState(false);

  React.useEffect(() => {
    gsap.to('body', { visibility: 'visible' });
  }, []);

  React.useEffect(() => {
    console.log({ currentUser });
  }, [currentUser]);

  React.useEffect(() => {
    console.log({ error });
    console.log({ userData });
    !loading && !error && setWebsite(userData.me.github.websiteUrl.slice(12));
    !loading && !error && setLocation(userData.me.twitter.location);
    !loading && !error && setDescription(userData.me.twitter.description);
    !loading && !error && setName(userData.me.twitter.name);
  }, [loading, error, userData]);

  React.useEffect(() => {
    console.log({ githubData });
    console.log({ twitterData });
  }, [githubData, twitterData]);

  const updateInfo = () => {
    if (checkboxGithub) {
      github({
        variables: {
          name: name !== '' ? name : null,
          location: location !== '' ? location : null,
          email: email !== '' ? email : null,
          bio: description !== '' ? description : null,
        },
      });
    }
    if (checkboxTwitter) {
      console.log({ description });
      const query = [
        ['url', website],
        ['location', location],
        ['description', description],
        ['name', name],
      ].filter((row) => Boolean(row[1]));
      console.log({ query });

      twitter({
        variables: {
          query: query,
        },
      }).then((res) => {
        if (res.data.twitter.makeRestCall.post.jsonBody.errors) {
          toast.error("Boo! It didn't work", { position: toast.POSITION.BOTTOM_CENTER });
        } else if (res.data.twitter.makeRestCall.post.response.statusCode === 200)
          toast.success('Updated!', { position: toast.POSITION.BOTTOM_CENTER });
      });
    }
  };

  const handleOnNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOnEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOnBioChange = (e) => {
    setDescription(e.target.value);
  };

  const handleOnLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleOnWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  return (
    // <TabPanel {...rest}>
    <section
      sx={{
        maxWidth: 1440,
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gap: 3,
        gridTemplateAreas: [
          `
            'form'
            'checkboxes'
            'auth'
            'push'
            `,
          `
            'checkboxes form  auth'
            'checkboxes form  auth'
            'checkboxes form  auth'
            'checkboxes form  auth'
            '.  push  .'
          `,
        ],
        gridAutoColumns: ['1fr', 'minmax(auto, 250px) 1fr minmax(auto, 300px)'],
        gridAutoRows: 'auto',
        my: 2,
      }}
    >
      <aside
        sx={{
          gridArea: 'checkboxes',
          height: '100%',
          minHeight: 500,
          boxShadow: 0,
          border: 'solid 3px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          p: 3,
          m: 3,
        }}
      >
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            height: '100%',
          }}
        >
          <p
            sx={{
              fontFamily: 'heading',
              fontWeight: 700,
              fontSize: [2, 3],
            }}
          >
            Select Platform
          </p>
          <Checkbox type="Github" onCheckboxChange={() => setCheckboxGithub((prev) => !prev)} />
          <Checkbox type="Twitter" onCheckboxChange={() => setCheckboxTwitter((prev) => !prev)} />

          <Checkbox type="dev.to" onCheckboxChange={() => setCheckboxTwitter((prev) => !prev)} disabled />
          <Checkbox type="CodePen" onCheckboxChange={() => setCheckboxTwitter((prev) => !prev)} disabled />
          <Checkbox type="LinkedIn" onCheckboxChange={() => setCheckboxTwitter((prev) => !prev)} disabled />
        </div>
      </aside>

      <div
        sx={{
          gridArea: 'form',
          height: '100%',
          maxHeight: 700,
          boxShadow: 0,
          border: 'solid 3px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          padding: 4,
          backgroundColor: 'background',
          m: 3,
        }}
      >
        <h2
          sx={{
            fontFamily: 'heading',
            color: 'text',
            fontWeight: 400,
          }}
        >
          Tell the world about yourself...
        </h2>
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Label>
            <LabelText>
              What should people call you? <Emoji ariaLabel="Two hands shaking">🤝🏽</Emoji>
            </LabelText>
            <Input
              type="text"
              name="name"
              handleChange={handleOnNameChange}
              value={name}
              ariaLabel="Your name"
              placeholder="Your Name..."
            />
          </Label>
          <Label>
            <LabelText>
              Where do you live? <Emoji ariaLabel="Planet earth">🌎</Emoji>
            </LabelText>
            <Input
              type="text"
              name="location"
              handleChange={handleOnLocationChange}
              value={location}
              ariaLabel="Your location"
              placeholder="Your Location..."
            />
          </Label>
          <Label>
            <LabelText>
              Got a personal site? Drop it here <Emoji ariaLabel="A floppy disk">💾</Emoji>
            </LabelText>
            <Input
              type="text"
              name="website"
              handleChange={handleOnWebsiteChange}
              value={website}
              ariaLabel="Your website"
              placeholder="Your Website..."
            />
          </Label>
          <Label>
            <LabelText>
              Your preferred email <Emoji ariaLabel="Email">📧</Emoji>
            </LabelText>
            <Input
              type="text"
              name="email"
              handleChange={handleOnEmailChange}
              value={email}
              ariaLabel="Your email"
              placeholder="Your email..."
            />
          </Label>
        </div>

        <Label>
          <LabelText>
            Who are you? Be creative, this short blurb could be first contact! <Emoji ariaLabel="A UFO">🛸</Emoji>
          </LabelText>
          <TextArea
            type="text"
            name="name"
            handleChange={handleOnBioChange}
            value={description}
            ariaLabel="Your bio"
            placeholder="Your Bio..."
          />
        </Label>
        <div
          sx={{
            marginTop: 20,
            textAlign: 'center',
          }}
        ></div>
      </div>

      <aside
        sx={{
          gridArea: 'auth',
          height: '100%',
          minHeight: 500,
          boxShadow: 0,
          border: 'solid 3px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          p: 3,
          m: 3,
        }}
      >
        <p
          sx={{
            fontFamily: 'heading',
            fontWeight: 700,
            fontSize: [2, 3],
          }}
        >
          Authorize Platform
        </p>
        <TwitterLogin />
        <DevToLogin />
        <CodePenLogin />
        <LinkedInLogin />
      </aside>

      <section
        sx={{
          gridArea: 'push',
          minWidth: [300, 500],
          maxHeight: 30,
          margin: '0 auto',
          m: 3,
        }}
      >
        <Button disabled={checkboxGithub || checkboxTwitter ? false : true} onClick={updateInfo} text="Push" />
      </section>
    </section>

    // </TabPanel>      {/* <ProfileCard name={name} bio={bio} location={location} website={website} email={email} />
  );
};

DevCardHub.tabsRole = 'TabPanel';

export default DevCardHub;
