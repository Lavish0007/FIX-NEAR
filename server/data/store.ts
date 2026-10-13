import bcrypt from 'bcryptjs';

export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  city: string;
  createdAt: Date;
}

export interface StoredIssue {
  _id: string;
  reportId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'UNDER REVIEW' | 'VERIFIED' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';
  userId: string;
  imageUrl?: string;
  frequency?: string;
  landmark?: string;
  createdAt: Date;
  resolvedAt?: Date | null;
}

export interface StoredNotification {
  _id: string;
  userId: string;
  message: string;
  type: 'STATUS_UPDATE' | 'COMMENT' | 'SYSTEM';
  read: boolean;
  createdAt: Date;
}

export interface StoredComment {
  _id: string;
  issueId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: Date;
}

// In-Memory Database collections
class MemoryStore {
  users: StoredUser[] = [];
  issues: StoredIssue[] = [];
  notifications: StoredNotification[] = [];
  comments: StoredComment[] = [];

  constructor() {
    this.seedDemoData();
  }

  seedDemoData() {
    // Demo User credentials as required by prompt
    const demoPasswordHash = bcrypt.hashSync('FixNear@2026', 10);
    const demoUserId = 'usr_demo_1001';

    const demoUser: StoredUser = {
      _id: demoUserId,
      name: 'Demo Citizen',
      email: 'demo@fixnear.app',
      password: demoPasswordHash,
      city: 'Metro Central',
      createdAt: new Date('2026-09-15T08:00:00Z'),
    };

    this.users = [demoUser];

    // 2-3 Demo issues for the demo user
    const demoIssue1: StoredIssue = {
      _id: 'iss_demo_001',
      reportId: 'FX-20261002-4821',
      title: 'Broken Streetlight near Main Gate',
      description:
        'The primary overhead streetlight fixture has stopped functioning, leaving the main crosswalk completely unlit after dark.',
      category: 'Streetlight',
      location: 'Near Main Gate, Sector 4',
      priority: 'HIGH',
      status: 'IN PROGRESS',
      userId: demoUserId,
      landmark: 'Opposite Central Park Gate 1',
      frequency: 'Continuous',
      createdAt: new Date('2026-10-01T09:30:00Z'),
      resolvedAt: null,
    };

    const demoIssue2: StoredIssue = {
      _id: 'iss_demo_002',
      reportId: 'FX-20261002-1204',
      title: 'Large Pothole on Market Road',
      description:
        'Substantial asphalt erosion has created a 15cm deep pothole causing two-wheelers to swerve dangerously during peak hours.',
      category: 'Road Damage',
      location: 'Market Road, near Bus Stand',
      priority: 'CRITICAL',
      status: 'REPORTED',
      userId: demoUserId,
      landmark: 'Next to Municipal Library',
      frequency: 'Daily traffic impact',
      createdAt: new Date('2026-10-02T02:15:00Z'),
      resolvedAt: null,
    };

    const demoIssue3: StoredIssue = {
      _id: 'iss_demo_003',
      reportId: 'FX-20260928-8921',
      title: 'Clogged Storm Drain at Block C',
      description:
        'Heavy silt accumulation prevented rain runoff from clearing, resulting in sidewalk waterlogging for 48 hours.',
      category: 'Drainage',
      location: 'Block C Footpath',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      userId: demoUserId,
      landmark: 'Corner of Lane 3',
      createdAt: new Date('2026-09-28T11:00:00Z'),
      resolvedAt: new Date('2026-10-01T16:00:00Z'),
    };

    this.issues = [demoIssue1, demoIssue2, demoIssue3];

    // Demo Notifications
    this.notifications = [
      {
        _id: 'notif_001',
        userId: demoUserId,
        message: 'Your report FX-20261002-4821 has been moved to IN PROGRESS.',
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date('2026-10-01T14:20:00Z'),
      },
      {
        _id: 'notif_002',
        userId: demoUserId,
        message: 'Welcome to FixNear! Your civic account is ready to log and track neighborhood repairs.',
        type: 'SYSTEM',
        read: true,
        createdAt: new Date('2026-09-15T08:00:00Z'),
      },
    ];

    // Demo Comments
    this.comments = [
      {
        _id: 'comm_001',
        issueId: demoIssue1._id,
        userId: demoUserId,
        userName: 'Demo Citizen',
        message: 'Local maintenance inspection team arrived and verified the wiring defect on the pole.',
        createdAt: new Date('2026-10-01T15:00:00Z'),
      },
    ];
  }
}

export const memoryStore = new MemoryStore();
