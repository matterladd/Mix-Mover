import { firefox } from "playwright";
import { ApplePlaylist, Track } from "../types/index.js";

// module scope to persist the same instance over every function call
const browser = await firefox.launch();
const context = await browser.newContext();
const page = await context.newPage();

export async function scrape_apple_playlist(
  playlist_url: string,
): Promise<ApplePlaylist> {
  await page.goto(playlist_url);
  const title = await page.evaluate(() => {
    const element = document.querySelector(".headings__title"); // `.` for CSS class shorthand
    return element?.children.item(0)?.textContent; // first child element is the <span> with the title
  });

  /**
   * As of 6/10/26, Apple Music playlist pages have their song titles and artists located in the
   * aria-label attribute with the format `'title, artist'`. This attribute is located in elements
   * that have the class `songs-list-row`.
   */
  const tracks = await page.evaluate(() => {
    const rows = document.querySelectorAll(".songs-list-row"); // get all row elements in the songs list
    return Array.from(rows).map((row) => {
      // create an Array from the NodeList
      return row.getAttribute("aria-label"); // maps each row's aria-label to a new array
    });
  });

  return {
    name: title as string,
    tracks: parse_tracks(tracks as string[]), // asserting type is not null
  };
}

function parse_tracks(tracks: string[]): Track[] {
  // TODO: consider songs with commas
  const parsed = tracks.map((line) => {
    const parsed_line = line.split(", ");
    return {
      name: parsed_line[0],
      artist: parsed_line[1],
    };
  });

  return parsed;
}
