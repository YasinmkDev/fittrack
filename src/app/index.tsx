import { Redirect } from 'expo-router';

/** App entry: the auth screen is the front door; it routes into the tabs. */
export default function Entry() {
  return <Redirect href="/auth" />;
}
