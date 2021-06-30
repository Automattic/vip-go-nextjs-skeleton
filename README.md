# VIP Go Next.js boilerplate for decoupled / headless WordPress applications

This is a [Next.js][nextjs] boilerplate intended for use with a WordPress backend hosted on VIP. In order to operate correctly, VIP's [decoupled bundle plugin][bundle] must be installed and activated.

Features:
+ Next.js 11
+ Default React components to showcase your content. Mix and match with your own design system.
+ Preview your content out of the box.
+ Code generation to provide easy querying and strong typings.

## Getting started

Change the environment variables in the `.env` file:
+ `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: This is your GraphQL endpoint. You can find it at Settings > VIP Decoupled.
+ `WORDPRESS_ENDPOINT`: This is your WordPress URL. It is used to aid in previewing your content and to provide feeds.

After these changes, you can start the development server using:

```bash
npm run dev
```

Your app will be accessible at [http://localhost:3000][local].

## How does this boilerplate work?

### WordPress GraphQL API responses

Whenever you request data from the your WordPress GraphQL API backend (either a `Post`, a `Page`, or your custom content type), you'll get a list of content blocks. These blocks depend on how your content was built (either using the classic editor, or the new blocks editor -Gutenberg-).

If you used the classic editor, the list will have one element with the whole content inside it. If your content was built with the new Gutenberg editor, you'll get a list where each element is a Gutenberg block like paragraph, heading, list, etc.

### Using your own React components

The way this boilerplate works is it matches each content block with a React component. Each Gutenberg block has a unique name, and based on that name we decide which component to map. For example, we match the Gutenberg block `core/heading` with our `Heading` component. The file `/components/PostContent/PostContent.tsx` shows this in action. If your content was built using the classic editor, your block will have a name of `core/classic-editor`.

In addition to this, each block can have some attributes. For example, our `core/heading` can have the `level` attribute (`h2`, `h3`...). Those attributes are also exposed via the API and can be passed to your component to change its behaviour. An example can be found on `/components/List/List.tsx`.

To use your own components, just change the default ones in `/components/PostContent/PostContent.tsx` or map your own blocks with your components.

Note: In `development`, if your WordPress GraphQL API returns a blocks that isn't matched with a component, an "Unsupported Block" error will be shown in your content. This will help you see which blocks aren't supported in your Next.js application.

### GraphQL queries

All GraphQL queries used in this boilerplate can be found in the `graphql` folder.

By default, your WordPress GraphQL API will expose your post types as separate entities. This means that you'll have a `Post` query, a `Page` query... with the same fields (title, content...). We think that's a lot of duplication.

To help with this, we introduced a new interface called `DisplayNodes` which covers the majority of cases we've seen in the wild. Post types implementing this interface can all be queried with the same GraphQL query. This means that instead of having different queries for Post and Page for example, we will only have one where we can filter by post type.

If you want to implement the `DisplayNodes` interface, this needs to be done on your WordPress application. Here is [how to do it](`TODO WE_DONT_HAVE_A_LINK_YET`) from our documentation.

If you have some post types that don't fit the `DisplayNodes` interface, you may need to use a specific query for those instead. An example can be found in `TODO THERE_IS_NO_EXAMPLE_YET`.

### Previewing

Previewing is one of those problems stopping a lot from adapting a decoupled architecture. We've made the work to support it out of the box for you.

The previewing is based on a token approach. This means that whenever you click the "Preview" button on WordPress, a new token will be created that gives access to that content for a short amount of time (10min). You'll be then redirected to the frontend app with the token appended to the url.

On the frontend app (this one), we'll intercept the token and use it to authenticate our request in order to get the content that's still in draft. This means that anyone with the url can access the content for a short amount of time. You can share your url with others in order to have a second eye on your content.

### Caching and default configuration

TODO

## FAQ

### Why are you using a [custom server][custom-server] instead of the one provided by Next.js?

WordPress VIP's platform requires a [healthcheck endpoint][healthcheck] to assist in monitoring. Providing this endpoint correctly requires a custom server. We have also found that it is easy to outgrow Next.js's builtin server, so having a custom server (based on [Express 4][express]) available out-of-the-box is useful.

[bundle]: https://github.com/Automattic/vip-decoupled-bundle
[custom-server]: https://nextjs.org/docs/advanced-features/custom-server
[express]: https://expressjs.com
[healthcheck]: https://docs.wpvip.com/technical-references/vip-platform/node-js/#h-requirement-1-exposing-a-health-route
[local]: http://localhost:3000
[nextjs]: https://nextjs.org
