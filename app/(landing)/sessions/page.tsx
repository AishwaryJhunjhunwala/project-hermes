import { getAllSessions } from '@/app/actions/public/sessions';
import SessionsContent from './sessions-content';

export const metadata = {
  title: 'Learning Sessions | Community',
  description:
    'Deep dive into technical topics with our expert-led sessions and hands-on workshops.',
};

export default async function SessionsPage() {
  const { upcomingSessions = [], pastSessions = [] } = await getAllSessions();

  return <SessionsContent upcomingSessions={upcomingSessions} pastSessions={pastSessions} />;
}
