// slidev-nav.mjs — route-asserting navigation helpers for Playwright-driven tools.
//
// Decks use `routerMode: hash`, so the route lives in location.hash:
//   #/N              slide N, click 0
//   #/N?clicks=C     slide N after C click steps
// Anything else (e.g. `#/<base>/N`, the Slidev 52.16.0 regression in LESSONS_LEARNED
// #18) is a navigation failure. These helpers never swallow a failed navigation and
// never sleep in place of a check: they wait for the expected route and throw with the
// actual route when it does not arrive.

const ROUTE_RE = /^#\/(\d+)(?:\?clicks=(\d+))?$/;
const DEFAULT_TIMEOUT = 15000;

/** Parse a Slidev hash route; null when it is not a well-formed `#/N[?clicks=C]`. */
export function parseRoute(hash) {
  const m = ROUTE_RE.exec(hash);
  return m ? { slide: Number(m[1]), clicks: m[2] === undefined ? 0 : Number(m[2]) } : null;
}

export function formatRoute({ slide, clicks }) {
  return clicks ? `#/${slide}?clicks=${clicks}` : `#/${slide}`;
}

async function currentHash(page) {
  return page.evaluate(() => location.hash);
}

/**
 * Wait until the page is on slide `slide` (optionally at `clicks`) and that slide is
 * rendered (`.slidev-page-N` exists). Throws with the actual route on timeout.
 */
export async function expectRoute(page, slide, { clicks, timeout = DEFAULT_TIMEOUT } = {}) {
  try {
    await page.waitForFunction(
      ({ slide, clicks, source }) => {
        const m = new RegExp(source).exec(location.hash);
        if (!m || Number(m[1]) !== slide) return false;
        if (clicks !== undefined && Number(m[2] ?? 0) !== clicks) return false;
        return document.querySelector(`.slidev-page-${slide}`) !== null;
      },
      { slide, clicks, source: ROUTE_RE.source },
      { timeout },
    );
  } catch (err) {
    const want = formatRoute({ slide, clicks: clicks ?? 0 }) + (clicks === undefined ? '[?clicks=*]' : '');
    throw new Error(`expected route ${want} with .slidev-page-${slide} rendered; got "${await currentHash(page).catch(() => '?')}" (${err.message.split('\n')[0]})`);
  }
}

/**
 * Navigate to `${deckUrl}/#/N`. A failed load (network error, HTTP error status) and a
 * route that never becomes `#/N` both throw. The first load of a document waits for
 * DOMContentLoaded (decks with web fonts never reach networkidle); later hash changes
 * are same-document navigations, so the route assertion is the real wait.
 */
export async function gotoSlide(page, deckUrl, slide, { timeout = DEFAULT_TIMEOUT } = {}) {
  const url = `${deckUrl.replace(/\/$/, '')}/#/${slide}`;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  if (response && !response.ok()) throw new Error(`GET ${url} returned HTTP ${response.status()}`);
  await expectRoute(page, slide, { clicks: 0, timeout });
}

/**
 * Press ArrowRight once and wait for the route to advance: either one more click on the
 * same slide, or the next slide at click 0. Returns the new route. Throws if the route
 * does not change within `timeout` (unless `atEnd` says the deck is on its last step)
 * or changes to anything other than those two routes.
 */
export async function pressNext(page, { timeout = DEFAULT_TIMEOUT, atEnd = false } = {}) {
  const before = parseRoute(await currentHash(page));
  if (!before) throw new Error(`not on a Slidev route before ArrowRight: "${await currentHash(page)}"`);
  await page.keyboard.press('ArrowRight');
  try {
    await page.waitForFunction((prev) => location.hash !== prev, formatRoute(before), { timeout: atEnd ? 2000 : timeout });
  } catch (err) {
    if (atEnd) return before;
    throw new Error(`ArrowRight did not change the route from ${formatRoute(before)} (${err.message.split('\n')[0]})`);
  }
  const hash = await currentHash(page);
  const after = parseRoute(hash);
  const nextClick = after && after.slide === before.slide && after.clicks === before.clicks + 1;
  const nextSlide = after && after.slide === before.slide + 1 && after.clicks === 0;
  if (!nextClick && !nextSlide) {
    throw new Error(`ArrowRight moved ${formatRoute(before)} -> "${hash}"; expected ${formatRoute({ ...before, clicks: before.clicks + 1 })} or #/${before.slide + 1}`);
  }
  await expectRoute(page, after.slide, { clicks: after.clicks, timeout });
  return after;
}
