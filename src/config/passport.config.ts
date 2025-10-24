import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

/**
 * Passport Configuration
 * Configure authentication strategies (Google OAuth, GitHub OAuth)
 */

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract profile data from Google
          const email = profile.emails?.[0]?.value;
          const displayName = profile.displayName;
          const photo = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email from Google'), undefined);
          }

          // Create user data object
          const userData = {
            googleId: profile.id,
            email: email,
            name: displayName || email.split('@')[0],
            avatarUrl: photo,
            accessToken,
            refreshToken: refreshToken || undefined,
          };

          // Pass to controller for processing (as any to bypass Express.User type)
          return done(null, userData as any);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
} else {
  console.warn(
    'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.'
  );
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
        scope: ['user:email', 'read:user'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          // Extract profile data from GitHub
          const email = profile.emails?.[0]?.value;
          const displayName = profile.displayName || profile.username;
          const photo = profile.photos?.[0]?.value;
          const bio = profile._json?.bio;
          const location = profile._json?.location;

          if (!email) {
            return done(new Error('No email from GitHub'), undefined);
          }

          // Create user data object
          const userData = {
            githubId: profile.id,
            email: email,
            name: displayName || email.split('@')[0],
            username: profile.username || email.split('@')[0],
            avatarUrl: photo,
            bio: bio,
            location: location,
            accessToken,
            refreshToken: refreshToken || undefined,
          };

          // Pass to controller for processing (as any to bypass Express.User type)
          return done(null, userData as any);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
} else {
  console.warn(
    'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in environment variables.'
  );
}

// Serialize user for session (not used in stateless JWT auth, but required by passport)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
