import SimplePage, { Block } from '../components/SimplePage.jsx'

export default function TermsOfService() {
  return (
    <SimplePage
      eyebrow="Terms"
      title="Terms of service"
      intro="The rules of the road for donors, receiving homes, and admins — written the way we'd actually explain them to a neighbor."
      updated="Last updated August 2026"
    >
      <Block title="What NourishConnect is">
        <p>
          NourishConnect is a matching service. We connect people who have
          extra food — a donor with too many groceries, a restaurant with
          leftover prepared meals, a family cleaning out the pantry — with
          receiving homes and shelters that can put it to use. We're the
          bridge, not the food bank itself.
        </p>
      </Block>

      <Block title="If you're donating food">
        <p>
          List only what's genuinely safe to eat and honestly described.
          Note the type of food, roughly when it was prepared or its
          expiry, and how soon it needs to be picked up. If something's
          past its best, don't list it — a receiving home is trusting your
          description without inspecting it first.
        </p>
        <p>
          You're free to cancel or edit a listing before it's picked up. If
          you commit to a drop-off time, please try to keep it — a
          receiving home may be planning meals around what you told them
          was coming.
        </p>
      </Block>

      <Block title="If you're a receiving home">
        <p>
          Keep your capacity and needs up to date so donations get matched
          sensibly — there's no point sending five trays of casserole to a
          home that already has a freezer full of them. Confirm pickups
          promptly, and let us know if a donation didn't show up or wasn't
          what was described, so we can follow up.
        </p>
      </Block>

      <Block title="Food safety, plainly">
        <p>
          NourishConnect doesn't inspect, test, or certify any donated food.
          We're the logistics layer that connects donors and receiving
          homes — the judgment calls about what's safe to give and safe to
          accept rest with the people actually handling the food.
          Perishables should move quickly, and anything questionable should
          be tossed rather than listed.
        </p>
      </Block>

      <Block title="Accounts">
        <p>
          Keep your login details to yourself and let us know if you think
          someone's gotten into your account without permission. We can
          suspend accounts that repeatedly misuse the platform — listing
          fake donations, no-showing on commitments, or generally making
          things harder for everyone else trying to get food to where it's
          needed.
        </p>
      </Block>

      <Block title="Liability, the honest version">
        <p>
          We do our best to keep the matching system reliable, but
          NourishConnect can't guarantee every donation arrives exactly as
          planned — deliveries can fall through, food can spoil faster than
          expected, plans can change. We're not liable for the condition of
          donated food or for losses that come from a donation not going
          through as arranged. If something goes wrong, tell us — we'd
          rather know and improve the system than have people quietly stop
          using it.
        </p>
      </Block>

      <Block title="Changes to these terms">
        <p>
          We'll update this page as the platform grows, and we'll try to
          flag anything significant rather than quietly slipping it in.
          Continuing to use NourishConnect after an update means you're
          okay with the new terms.
        </p>
      </Block>
    </SimplePage>
  )
}
