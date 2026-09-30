import { redirect } from 'next/navigation';
import { RedirectType } from 'next/navigation';

export default function RootRegisterPage() {
  redirect('/register/patient', RedirectType.replace);
}
