export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  duration: string;
}

export interface Profile {
  name: string;
  headline: string;
  avatar: string;
  banner: string;
  location: string;
  connectionsCount: number;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: string[]; // User IDs or names who liked it
  comments: Comment[];
  sharesCount: number;
  timestamp: string;
  tags?: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  description: string;
  requirements: string[];
  applied: boolean;
  postedAt: string;
}

export interface Connection {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  banner?: string;
  status: 'connected' | 'pending_sent' | 'pending_received' | 'suggested';
  mutualConnections: number;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: 'me' | string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participant: Connection;
  messages: Message[];
  unread: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'connection_accept' | 'connection_request' | 'job_alert';
  senderName: string;
  senderAvatar: string;
  senderHeadline?: string;
  text: string;
  targetId?: string; // id of post or job
  timestamp: string;
  read: boolean;
}
