# Next.js Storybooks.

The application uses GitHub authentication, therefore you must set it up and fill these environment variables are to run this application correctly:

```bash
OAUTH_CLIENT_KEY='github oauth app id'
OAUTH_CLIENT_SECRET='github oauth app secret'
```

There is a `.env.local.example` file with a base for you. Rename it to `.env.local` and add the correct values for the GitHub tokens. You can follow [instructions here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) on how to do that, or do the following:

1 - Navigate to https://github.com/settings/developers
2 - Click on New OAuth App
3 - Set any app name you want
4 - Set `http://localhost:3000` as Homepage URL
5 - Set `http://localhost:3000/auth` as Authorization callback URL
6 - Create app
7 - Access the newly created app's page and get the **Client ID** and use it for the `OAUTH_CLIENT_KEY` variable in the env file
8 - Click on **Generate a new client secret** and use its value for the `OAUTH_CLIENT_SECRET` variable in the env file

You are now ready to run the application.

### Setting up Prisma database

This application uses Prisma with SQLite. You need to set it up before running:
### use NPM or PNPM to installing packages

1. `pnpm install`
2. `pnpm prisma:setup`

### Running the app locally

1. `pnpm install`
2. `pnpm prisma:setup` (if you haven't already)
3. `pnpm dev`

Go to `localhost:3000`.

### Running Storybook locally

1. `pnpm install`
2. `pnpm prisma:setup` (if you haven't already)
3. `pnpm storybook`

Go to `localhost:6006`.

