import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/utils";

export type NoteEntry = CollectionEntry<"notes">;

export function noteSlug(note: NoteEntry): string {
  return note.data.translationKey ?? note.id;
}

export async function getPublishedNotes(lang: Lang): Promise<NoteEntry[]> {
  const notes = await getCollection(
    "notes",
    ({ data }) => !data.draft && data.lang === lang,
  );

  assertUniqueNoteSlugs(notes, lang);
  return notes;
}

function assertUniqueNoteSlugs(notes: NoteEntry[], lang: Lang): void {
  const idsBySlug = new Map<string, string[]>();

  for (const note of notes) {
    const slug = noteSlug(note);
    const ids = idsBySlug.get(slug) ?? [];
    ids.push(note.id);
    idsBySlug.set(slug, ids);
  }

  for (const [slug, ids] of idsBySlug) {
    if (ids.length > 1) {
      throw new Error(
        `Notes "${ids.join('", "')}" share slug "${slug}" for language "${lang}".`,
      );
    }
  }
}

export async function assertTranslationIntegrity(): Promise<void> {
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  const englishByKey = new Map(
    notes
      .filter((note) => note.data.lang === "en")
      .map((note) => [noteSlug(note), note]),
  );

  for (const translation of notes.filter((note) => note.data.lang !== "en")) {
    const key = noteSlug(translation);
    const source = englishByKey.get(key);

    if (!translation.data.translationKey) {
      throw new Error(
        `Translated note "${translation.id}" must declare translationKey.`,
      );
    }
    if (!source) {
      throw new Error(
        `Translated note "${translation.id}" references missing English note "${key}".`,
      );
    }

    const fields = ["pubDate", "collection", "series", "seriesOrder"] as const;
    for (const field of fields) {
      const sourceValue = source.data[field];
      const translatedValue = translation.data[field];
      const equal =
        sourceValue instanceof Date && translatedValue instanceof Date
          ? sourceValue.valueOf() === translatedValue.valueOf()
          : sourceValue === translatedValue;

      if (!equal) {
        throw new Error(
          `Translated note "${translation.id}" must match "${source.id}" field "${field}".`,
        );
      }
    }
  }
}
