[Skip to main content](https://arielsalminen.com/2022/launching-nord-design-system/#content)## [arielsalminen.com](https://arielsalminen.com/)
  * [Home Home](https://arielsalminen.com/)
  * [About About](https://arielsalminen.com/about/)
  * [Services Services](https://arielsalminen.com/services/)
  * [Blog Blog](https://arielsalminen.com/writing/)
  * [Contact Contact](https://arielsalminen.com/contact/)
  * Use 'Arrow up' and 'Arrow down' to navigate the search results. Press 'Enter' to confirm your selection. Press 'Escape' to close the search.
Search this website
`↓↑` to navigate _|_ `⏎` to select _|_ `Esc` to dismiss
  * [](https://arielsalminen.com/feed/)


# Launching Nord Design System
We’re excited to announce the first major release of [Nord Design System](https://nordhealth.design/), `v1.0`. With this release, our design systems team is shipping a number of new tools and features to improve the experience of designing, building, and shipping products at [Nordhealth](https://nordhealth.com/).
Looking back in time, we started our design systems journey at the [end of 2020](https://nordhealth.design/roadmap/) with initial user research, but the concrete design and development work on the system didn’t start before the late summer 2021 when [Eric Habich](https://www.linkedin.com/in/eric-habich-236484ab/), [Nick Williams](https://twitter.com/wickynilliams), and [David Darnes](https://twitter.com/daviddarnes) joined the team.
Now, 8 months later, I’m excited that we’re launching [Nord Design System](https://nordhealth.design) and all of our tools for production usage! To learn more about the new features included, keep reading below. 🎉
## New Packages [#](https://arielsalminen.com/2022/launching-nord-design-system/#new-packages)
Nord Design System is divided into [7 npm packages](https://nordhealth.design/start/) and a [Figma Toolkit](https://nordhealth.design/figma/). All of the packages can be used together or separately depending on the product team’s needs and often developers might install several of them in order to use Nord Design System, including:
  * `@nordhealth/components`
  * `@nordhealth/react`
  * `@nordhealth/tokens`
  * `@nordhealth/themes`
  * `@nordhealth/css`
  * `@nordhealth/icons`
  * `@nordhealth/fonts`

[![Nord Design System packages](https://arielsalminen.com/img/blog/nord/packages.jpg)](https://nordhealth.design/)
## Figma Toolkit [#](https://arielsalminen.com/2022/launching-nord-design-system/#figma-toolkit)
Nord’s [Figma Toolkit](https://nordhealth.design/figma/) is a resource for exploration and collaboration. It contains the building blocks for designing with Nord. Our goal was to create a toolkit that anyone at [Nordhealth](https://nordhealth.com) could use to prototype ideas. We’ve written more about the toolkit and our thinking behind it in one of our [monthly updates](https://nordhealth.design/updates/january-2022/).
Our plan is to open source parts of the library in the [Figma Community](https://www.figma.com/@nordhealth) soon so that anyone can learn how we use Figma and benefit from the work we’re doing. Take a sneak peek of our [Figma Community page](https://www.figma.com/@nordhealth) to follow us and stay up to date on what we’ll publish there.
[![Nord Design System Figma Toolkit](https://arielsalminen.com/img/blog/nord/figma.png)](https://nordhealth.design/figma/)
## Theming [#](https://arielsalminen.com/2022/launching-nord-design-system/#theming)
Nord uses [CSS Custom Properties](https://nordhealth.design/themes/#creating-themes) _(sometimes referred to as CSS variables)_ to make its parts themable. CSS Custom Properties allow us to have our values stored in one place, then referenced in multiple other places.
[![Nord Design System Themes](https://arielsalminen.com/img/blog/nord/themes.png)](https://nordhealth.design/themes/)
A single [theme in Nord](https://nordhealth.design/themes/) is basically a plain CSS file which contains a `:root` CSS pseudo-class which declares global colors, gradients, box-shadows, and color aliases for the theme. Themes are usually referenced after our CSS Framework in the `<head>` of an application:

```
:root {
  /* ACCENT COLOR */
  --n-color-accent: {color};

  /* TEXT COLORS */
  --n-color-text: {color};
  --n-color-text-link: {color};
  --n-color-text-weak: {color};
  --n-color-text-weaker: {color};
  --n-color-text-weakest: {color};
  --n-color-text-on-accent: {color};
  --n-color-text-error: {color};
  --n-color-text-success: {color};

  /* NAVIGATION COLORS */
  --n-color-nav-surface: {color};
  --n-color-nav-heading: {color};
  --n-color-nav-hover: {color};

  /* BORDER COLORS */
  --n-color-border: {color};
  --n-color-border-strong: {color};

  /* SKIN COLORS */
  --n-color-surface: {color};
  --n-color-background: {color};
  --n-color-surface-raised: {color};

  /* STATUS COLORS */
  --n-color-status-warning: {color};
  --n-color-status-highlight: {color};
  --n-color-status-danger: {color};
  --n-color-status-success: {color};
  --n-color-status-info: {color};

  /* ETC… */
}
```

Nord’s theming also comes with a concept called [Accent color](https://nordhealth.design/themes/#accent-color) which allows developers to provide a slightly branded experience for the users without having to build a full theme from scratch:

```
:root {
  /* CUSTOM ACCENT COLORS */
  --n-color-accent: {accent-color};
  --n-color-text-on-accent: {text-on-accent-color};
}
```

## Dark mode [#](https://arielsalminen.com/2022/launching-nord-design-system/#dark-mode)
Dark mode is a user interface mode that displays light text on a dark background. [Dark mode](https://nordhealth.design/themes/#dark-mode) is helpful for those viewing device screens at night, in dark environments, or find darker UI more accessible. The reduced brightness can reduce eye strain in low light conditions.
CSS Custom Properties used in [Nord’s theming](https://nordhealth.design/themes/) make supporting dark mode incredibly quick and performant. A typical scenario here could be that we already have a light theme in an application, and want to build support for a darker counterpart. Nord now supports this out of the box so that we can provide a better experience for our users.
[![Nord Design System Dark mode](https://arielsalminen.com/img/blog/nord/dark-mode.png)](https://nordhealth.design/themes/#dark-mode)
## Theme Builder [#](https://arielsalminen.com/2022/launching-nord-design-system/#theme-builder)
We’ve created a tool called [theme builder](https://nordhealth.design/theme-builder/) that our teams can use to test out the existing themes and the provided theming options. This can be useful for demo­nstrating the theming capabilities to users.
[![Nord Design System Theme Builder](https://arielsalminen.com/img/blog/nord/theme-builder.png)](https://nordhealth.design/theme-builder/)
[Theme builder](https://nordhealth.design/theme-builder/) allows developers to try features such as `Accent color` before implementing them into production environment and demo­nstrates how to programmatically pick the right text color based on the contrast ratio using our provided [getTextColor function](https://arielsalminen.com/2022/launching-nord-design-system/):

```
/*!
  * Get Nord text color for chosen accent color.
  * Derived from work by Brian Suda and Chris Ferdinandi.
  * MIT License.
  *
  * @param  {String} A hex color value
  * @return {String} The contrasting color (#0c1a3d or #fff)
  */
function getTextColor(color) {
  // If a leading # is provided, remove it
  if (color.slice(0, 1) === "#") {
    color = color.slice(1)
  }

  // If 3 character hex, convert to 6 character
  if (color.length === 3) {
    color = color.split("").map((hex) => {
      return hex + hex
    }).join("")
  }

  // Convert to RGB value
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)

  // Get YIQ color space ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Finally return contrasting text color
  return yiq >= 160 ? "#0c1a3d" : "#fff"
}
```

The above function can be utilized with for example a color input. When the input value changes, we can set the new accent colors into a `:root` CSS pseudo-class:

```
<label for="color">Accent color</label>
<input id="color" type="color" value="#3559c7" />

<script>
  const input = document.querySelector("#color")
  const root = document.documentElement

  input.addEventListener("input", () => {
    const color = input.value
    const textColor = getTextColor(color)

    root.style.setProperty("--n-color-accent", color)
    root.style.setProperty("--n-color-text-on-accent", textColor)
  })
</script>
```

## Design Tokens [#](https://arielsalminen.com/2022/launching-nord-design-system/#design-tokens)
[Design tokens](https://nordhealth.design/tokens/) are a central location to store design related information such as colors, fonts, sizes, and transitions. These raw values are automatically transformed to different formats like Sass, CSS, JSON, and more. Nord Design System uses design tokens instead of hard coded values to ensure a better UI consistency across different platforms _(hat tip to[Jina](https://twitter.com/jina)!)._
Please note that in most cases developers don’t have to install our [design tokens package](https://nordhealth.design/tokens/) directly, they can use our [CSS framework](https://nordhealth.design/css/) instead as it imports this package internally and gives access to both the tokens and a wide range of shorthand utility classes to modify an element’s appearance in their application.
[![Nord Design System Design Tokens](https://arielsalminen.com/img/blog/nord/tokens.png)](https://nordhealth.design/tokens/)
## Web Components [#](https://arielsalminen.com/2022/launching-nord-design-system/#web-components)
Nord makes it effortless to implement and use its components across any framework or no framework at all. We accomplish this by using standardized web platform APIs and [Web Components](https://nordhealth.design/components/).
We’ve chosen to use [Web Components](https://nordhealth.design/components/) because there is a strong requirement for Nord to be used in many different contexts and with varying technologies — from static HTML pages to server-rendered apps, through to single page applications authored with frameworks such as [React](https://nordhealth.design/web-components/#react) and [Vue.js](https://nordhealth.design/web-components/#vue). Web Components work great for Nord, because they:
  * **Are tech-agnostic instead of tech-specific**
  * **Future proof our system with Web Standards**
  * **Allow us to use any framework or no framework at all**
  * **Provide great encapsulation for styles and functionality**

[![Nord Design System web Components](https://arielsalminen.com/img/blog/nord/components.png)](https://arielsalminen.com/2022/launching-nord-design-system/)
## React Components [#](https://arielsalminen.com/2022/launching-nord-design-system/#react-components)
Whilst [React](https://nordhealth.design/web-components/#react) supports Web Components, they are sligthly awkward to use as-is. For this reason, we provide [React-specific wrapper components](https://nordhealth.design/web-components/#react) in a package called `@nordhealth/react`. This will allow developers to use the Nord components as you would any other React component.
A planned future release of React will greatly improve support for Web Components, which will make the wrapper components unnecessary. But until then, we recommend their use.

```
import "@nordhealth/css"
import { Button } from "@nordhealth/react"
import ReactDOM from "react-dom"

function App() {
  return (
    <Button variant="primary">Hello world</Button>
  )
}

ReactDOM.render(
  <App />,
  document.querySelector("#app")
)
```

## CSS Framework [#](https://arielsalminen.com/2022/launching-nord-design-system/#css-framework)
Nord Design System’s [CSS Framework](https://nordhealth.design/css/) includes a wide range of shorthand utility classes to modify an element’s appearance in your application. The primary goal of this framework is to provide a method of styling elements with as little friction as possible.
Our CSS Framework also makes it possible to use the [design tokens](https://nordhealth.design/tokens/) through memorable CSS based utility classes. Developers can either use this framework standalone, or with another CSS framework, as our CSS selectors are prefixed with `.n-` to prevent collisions.
[![Nord Design System CSS Framework](https://arielsalminen.com/img/blog/nord/css.svg)](https://nordhealth.design/css/)
## RTL Support and Logical Properties [#](https://arielsalminen.com/2022/launching-nord-design-system/#rtl-support-and-logical-properties)
Historically in CSS, we used to apply properties such as `margin` relative to the direction of their sides. For example, `margin-left` was applied to the physical left side of an element. With logical properties, `margin-left` becomes `margin-inline-start`. This means that regardless of the language and text direction, the element will always have appropriate margin rules even in right-to-left languages.
Supporting multilingual applications and websites was an important requirement for [Nord Design System](https://nordhealth.design). This is why we’ve made sure to use Logical Properties across all of our tools and also built test automation that warns us if we accidentally use the old style properties such as `margin`, `padding`, or `border`.
[Rachel Andrew](https://www.smashingmagazine.com/2018/03/understanding-logical-properties-values/) explaining the logic:
> “… these values have moved away from the underlying assumption that content on the web maps to the physical dimensions of the screen, with the first word of a sentence being top left of the box it is in. The order of lines in grid-area makes complete sense if you had never encountered the existing way that we set these values in a shorthand.”
## Nordicons [#](https://arielsalminen.com/2022/launching-nord-design-system/#nordicons)
[Nordicons](https://nordhealth.design/nordicons/) is our proprietary icon library. We use Nordicons to provide addi­tional meaning or in places where text label doesn’t fit. They communicate messages at a glance and draw attention to important information.
The easiest and recommended way to use Nordicons is via our dedicated [Icon component](https://nordhealth.design/components/icon/) that allows developers at [Nordhealth](https://nordhealth.com) to use all our icons and set their size and color according to our design tokens. The icon component provides properties that allow developers to adjust the following:
  * **Name of the icon from Nordicons**
  * **Size of the icon according to our icon sizing tokens**
  * **Color of the icon according to our color tokens**
  * **Accessible label for the icon**

[![Nord Design System Nordicons](https://arielsalminen.com/img/blog/nord/nordicons.png)](https://nordhealth.design/nordicons/)
## Webfonts [#](https://arielsalminen.com/2022/launching-nord-design-system/#webfonts)
[Nord Design System](https://nordhealth.design) provides a constrained, purposeful set of typographic styles that we use to present user interface and content as clearly and efficiently as possible.
For digital products, we use a [typeface called Inter](https://nordhealth.design/typography/) which is carefully crafted and designed for computer screens specifically. It features a tall x-height to aid in readability of mixed-case and lower-case text. Several [OpenType features](https://nordhealth.design/typography/) are provided as well, like contextual alternates and slashed zero for when you need to disambiguate `0` from `O`.
[![Nord Design System Webfonts](https://arielsalminen.com/img/blog/nord/type.png)](https://nordhealth.design/typography/)
## Nord CDN [#](https://arielsalminen.com/2022/launching-nord-design-system/#nord-cdn)
Nord serves all of its packages via a [Content Delivery Network](https://nordhealth.design/cdn/) for better performance and stability. [Nord CDN](https://nordhealth.design/cdn/) also makes it fast to implement and use our packages for design work and prototyping user interface features. Some of the benefits of using Nord’s CDN include:
  * **Faster load times and better performance for all users**
  * **CDN scales more rapidly during heavy traffic**
  * **Minimizes risk of traffic spikes at point of origin, ensuring stability**
  * **Decreases infrastructure costs due to traffic offloading**
  * **Faster to get up and running with development work**

[![Nord Design System CDN](https://arielsalminen.com/img/blog/nord/cdn.jpg)](https://nordhealth.design/cdn/)
## Documentation [#](https://arielsalminen.com/2022/launching-nord-design-system/#documentation)
Finally, but not the least, we’ve put a lot of effort into documenting the usage of different tools and decisions we’ve made along the way. For this, we’ve used a tool called [Eleventy](https://www.11ty.dev/) which generates everything from our [interactive component playgrounds](https://nordhealth.design/components/button/) to [static documentation pages](https://nordhealth.design/colors/) that you can see on [nordhealth.design](https://nordhealth.design/) website.
The [documentation itself](https://nordhealth.design/) is public as it makes sharing and collaboration between different teams and third party vendors much easier as it increases the system’s visibility and accountability. This also makes us push towards higher quality and enables us to be more transparent. Finally, it serves as an amazing tool that we can leverage in recruiting.
[![Nord Design System Documentation](https://arielsalminen.com/img/blog/nord/line-length.png)](https://arielsalminen.com/2022/launching-nord-design-system/)
## What’s Coming Next [#](https://arielsalminen.com/2022/launching-nord-design-system/#what%E2%80%99s-coming-next)
The [Nord team](https://nordhealth.design/about/) is excited to finally bring these updates to everyone working at [Nordhealth](https://nordhealth.com)! 🥳 All of our tools are out of beta phase starting today and ready for production usage. There’re obviously many items we wanted to see in version `1.0` that didn’t quite make it. We’re excited to bring those to our users later this year. Next, we’ll be focusing on the following features:
  * **Improved internationalization support for Web Components**
  * **Product team support by setting up knowledge-sharing processes that promote collaboration, pairing, and training**
  * **Forming new Nordhealth wide contribution models**
  * **Improving our test and process automation**
  * **Defining backlog prioritization model**
  * **Adding more features, components, and fixing bugs**
  * **[And more…](https://nordhealth.design/roadmap/)**


If you have questions or feedback for us, feel free to reach out to us via [Slack](https://nordhealth.design/help/#slack-channels), [Office Hours](https://nordhealth.design/help/#office-hours), [Monthly Meetups](https://nordhealth.design/help/#monthly-meetups), and also the [feedback functionality](https://nordhealth.design/faq/) found from the bottom of each page. Hope to hear from you soon.
**P.S.** _[We’re hiring for Nord team](https://nordhealth.design/careers/)!_  
**P.P.S.** _[We’ve got interesting statistics about Nord here](https://arielsalminen.com/2022/nord-statistics-for-the-first-year/)!_
![Written by Ariel Salminen.](https://arielsalminen.com/img/signature.png)
[![Ariel Salminen.](https://arielsalminen.com/img/arielle.webp) Get in Touch Does your team need help? I’m Ariel Salminen, a Design Systems Architect specialized in helping organizations build and maintain design systems. I’m available for both local and remote projects around the world. ](https://arielsalminen.com/)
## Published
April 5th, 2022
## Follow @Ariel
  * [LinkedIn](https://www.linkedin.com/in/arielsalminen/)
  * [Bluesky](https://bsky.app/profile/arielsalminen.com)
  * [Mastodon](https://front-end.social/@ariel)
  * [GitHub](https://github.com/arielsalminen)
  * [RSS Feed](https://arielsalminen.com/atom.xml)
  * ~~Instagram~~
  * ~~Twitter / X~~


### Keyboard Shortcuts
  * Press `Ctrl`+`K` to open the search.
  * Press `⏎` to select a search result.
  * Press `↓` to navigate to the next search result.
  * Press `↑` to navigate to the previous search result.
  * Press `Esc` to dismiss the search or a modal.
  * Press `⇥` to navigate forward on the page.
  * Press `⇧`+`⇥` to navigate backward on the page.
  * Press `Alt`+`A` to toggle the layout grid.
  * Press `Alt`+`R` to toggle the color blind mode.
  * Press `Alt`+`I` to toggle the invert mode.
  * Press `Alt`+`E` to toggle the low vision mode.
  * Press `Alt`+`L` to open this modal.

Close
Connect with me on [LinkedIn](https://www.linkedin.com/in/arielsalminen/), [Bluesky](https://bsky.app/profile/arielsalminen.com), [Mastodon](https://front-end.social/@ariel) or [GitHub](https://github.com/arielsalminen).
[FAQ](https://arielsalminen.com/faq/) | [Accessibility](https://arielsalminen.com/accessibility/) | [Privacy](https://arielsalminen.com/privacy/) | [Webrings](https://arielsalminen.com/webrings/) | [Shortcuts](https://arielsalminen.com/2022/launching-nord-design-system/#keyboard-shortcuts) | [RSS Feed](https://arielsalminen.com/feed/) | © 1984 – 2026 Ariel Salminen.
