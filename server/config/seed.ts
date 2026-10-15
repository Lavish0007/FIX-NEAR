import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Issue } from '../models/Issue';
import { Notification } from '../models/Notification';
import { Comment } from '../models/Comment';
import { getIsDbConnected } from './db';

/**
 * Auto-seeds the default demo account and initial demo issues into MongoDB Atlas
 * only if the demo account does not exist yet.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  if (!getIsDbConnected()) return;

  try {
    const demoEmail = 'demo@fixnear.app';
    const existingDemo = await User.findOne({ email: demoEmail });

    if (!existingDemo) {
      console.log('Seeding initial demo account into MongoDB Atlas...');
      const hashedPassword = await bcrypt.hash('FixNear@2026', 10);

      const demoUser = await User.create({
        name: 'Demo Citizen',
        email: demoEmail,
        password: hashedPassword,
        city: 'Metro Central',
        createdAt: new Date(),
      });

      const issue1 = await Issue.create({
        reportId: 'FX-20261002-4821',
        title: 'Broken Streetlight near Main Gate',
        description:
          'The primary overhead streetlight fixture has stopped functioning, leaving the main crosswalk completely unlit after dark.',
        category: 'Streetlight',
        location: 'Near Main Gate, Sector 4',
        priority: 'HIGH',
        status: 'IN PROGRESS',
        userId: demoUser._id,
        landmark: 'Opposite Central Park Gate 1',
        frequency: 'Continuous',
        createdAt: new Date(),
        resolvedAt: null,
      });

      await Issue.create({
        reportId: 'FX-20261002-1204',
        title: 'Large Pothole on Market Road',
        description:
          'Substantial asphalt erosion has created a 15cm deep pothole causing two-wheelers to swerve dangerously during peak hours.',
        category: 'Road Damage',
        location: 'Market Road, near Bus Stand',
        priority: 'CRITICAL',
        status: 'REPORTED',
        userId: demoUser._id,
        landmark: 'Next to Municipal Library',
        frequency: 'Daily traffic impact',
        createdAt: new Date(),
        resolvedAt: null,
      });

      await Notification.create({
        userId: demoUser._id,
        message: 'Your report FX-20261002-4821 has been moved to IN PROGRESS.',
        type: 'STATUS_UPDATE',
        read: false,
        createdAt: new Date(),
      });

      await Comment.create({
        issueId: issue1._id,
        userId: demoUser._id,
        userName: 'Demo Citizen',
        message: 'Local maintenance inspection team arrived and verified the wiring defect on the pole.',
        createdAt: new Date(),
      });

      console.log('Demo account and sample issues seeded successfully into MongoDB Atlas.');
    }
  } catch (error: unknown) {
    console.error(
      'Error seeding demo data into MongoDB:',
      error instanceof Error ? error.name : 'UnknownError'
    );
  }
}
