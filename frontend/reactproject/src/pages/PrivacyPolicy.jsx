import SimplePage, { Block } from '../components/SimplePage.jsx'

export default function PrivacyPolicy() {
  return (
    <SimplePage
      eyebrow="Privacy"
      title="Your privacy policy"
      intro="Short version: we collect only what we need to get your food from your kitchen to someone's table, and we don't sell it to anyone."
      updated="Last updated August 2026"
    >
      <Block title="What we actually collect">
        <p>
          When you sign up as a donor, we ask for your name, email, phone
          number, and a general pickup or drop-off location. When you list a
          donation, we note what the food is, roughly how much of it there
          is, and when it needs to be picked up before it goes bad. Receiving
          homes give us similar basics — a contact person, an address, and
          what they're set up to store and serve.
        </p>
        <p>
          That's it. We're not tracking your browsing habits across other
          sites, and we're not building an advertising profile on you. This
          is a food logistics tool, not a marketing platform.
        </p>
      </Block>

      <Block title="Why we need it">
        <p>
          Every piece of information we ask for exists to answer one
          question: how does this food get to a home that needs it, safely
          and on time? Your contact details let a receiving home or a
          delivery volunteer reach you if plans change. Your donation
          history lets you see your own impact over time — how many meals
          your extra groceries turned into.
        </p>
      </Block>

      <Block title="Who sees what">
        <p>
          When you list a donation, the receiving home matched to it can see
          your name, contact info, and pickup location — the same way you'd
          expect if you were dropping something off in person. We don't
          publish your personal details anywhere public, and other donors
          can't see your account information.
        </p>
        <p>
          Admins on the platform can see donation and account details across
          the network, because someone has to keep the matching system
          running and step in if a handoff falls through. Admin access is
          limited to people directly involved in running NourishConnect.
        </p>
      </Block>

      <Block title="What we don't do">
        <ul className="list-disc space-y-2 pl-5">
          <li>We don't sell your information to anyone, ever.</li>
          <li>We don't share your data with advertisers.</li>
          <li>
            We don't keep information longer than we need it for — old,
            completed donation records are kept mainly so you can look back
            at your own history, and you can ask us to remove your account
            data at any time.
          </li>
        </ul>
      </Block>

      <Block title="Cookies and the boring technical bits">
        <p>
          We use basic session storage to keep you logged in while you use
          the site. There's no third-party tracking pixel hiding in the
          background, and we're not running ad networks on top of a food
          donation app.
        </p>
      </Block>

      <Block title="Questions about your data">
        <p>
          If you want to know exactly what we have on file, or you'd like it
          deleted, reach out to us using the Partner With Us page or the
          contact details in the footer. We'll sort it out — no forms in
          triplicate required.
        </p>
      </Block>
    </SimplePage>
  )
}
