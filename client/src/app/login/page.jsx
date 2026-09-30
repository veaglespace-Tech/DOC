import { redirect } from 'next/navigation';
import { RedirectType } from 'next/navigation';

export default function RootLoginPage() {
  redirect('/login/patient', RedirectType.replace);
}
