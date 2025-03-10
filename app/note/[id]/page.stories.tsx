import { type Meta, type StoryObj } from '@storybook/react';
import { cookies } from '@storybook/nextjs/headers.mock';
import { http } from 'msw';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import Page from './page';
import { db, initializeDB } from '#lib/db.mock';
import { createUserCookie, userCookieKey } from '#lib/session';
import { PageDecorator } from '#.storybook/decorators';
import { login } from '#app/actions.mock';
import * as auth from '#app/auth/route';
import { expectRedirect } from '#lib/test-utils';
import { getRouter } from '@storybook/nextjs/navigation.mock';

const meta = {
  component: Page,
  decorators: [PageDecorator],
  async beforeEach() {
    await db.note.create({
      data: {
        title: 'Module mocking in Storybook?',
        body: "Yup, that's a thing now! 🎉",
        createdBy: 'storybookjs',
      },
    })
    await db.note.create({
      data: {
        title: 'RSC support as well??',
        body: 'RSC is pretty cool, even cooler that Storybook supports it!',
        createdBy: 'storybookjs',
      },
    })
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/note/[id]',
        query: { id: '1' },
      },
    },
  },
  args: { params: { id: '1' } },
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

export const LoggedIn: Story = {
  async beforeEach() {
    cookies().set(userCookieKey, await createUserCookie('storybookjs'))
  },
}

export const NotLoggedIn: Story = {}

export const LoginShouldGetOAuthTokenAndSetCookie: Story = {
  parameters: {
    msw: {
      // Mock out OAUTH
      handlers: [
        http.post(
          'https://github.com/login/oauth/access_token',
          async ({ request }) => {
            let json = (await request.json()) as any
            return Response.json({ access_token: json.code })
          },
        ),
        http.get('https://api.github.com/user', async ({ request }) =>
          Response.json({
            login: request.headers.get('Authorization')?.replace('token ', ''),
          }),
        ),
      ],
    },
  },
  beforeEach() {
    // Point the login implementation to the endpoint github would have redirected too.
    login.mockImplementation(async () => {
      return await auth.GET(new Request('/auth?code=storybookjs'))
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(cookies().get(userCookieKey)?.value).toBeUndefined()
    await userEvent.click(
      await canvas.findByRole('menuitem', { name: /login to add/i }),
    )
    await expectRedirect('/')
    await expect(cookies().get(userCookieKey)?.value).toContain('storybookjs')
  },
}

export const LogoutShouldDeleteCookie: Story = {
  async beforeEach() {
    cookies().set(userCookieKey, await createUserCookie('storybookjs'))
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(cookies().get(userCookieKey)?.value).toContain('storybookjs')
    await userEvent.click(await canvas.findByRole('button', { name: 'logout' }))
    await expectRedirect('/')
    await expect(cookies().get(userCookieKey)).toBeUndefined()
  },
}

export const SearchInputShouldFilterNotes: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { q: 'RSC' },
      },
    },
  },
}

export const EmptyState: Story = {
  async beforeEach() {
    initializeDB({}) // init an empty DB
  },
}
