import { createAchievementTests } from '@neothink/testing/api/achievements';
import achievementsHandler from '../../pages/api/achievements';

// Use shared test suite for Ascenders achievements
createAchievementTests('ascenders', achievementsHandler); 