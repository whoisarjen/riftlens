import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { champions, items, runes } from "@/lib/db/schema";
import {
  getLatestVersion,
  getChampionData,
  getItemData,
  getRuneData,
  championImageUrl,
  itemImageUrl,
} from "@/lib/riot/ddragon";
import { aggregateChampionStats } from "@/lib/db/queries/aggregation";

/**
 * POST /api/champions/sync
 *
 * Fetches latest data from Data Dragon and upserts champions, items, and runes
 * into the database. Then triggers champion stats aggregation.
 */
export async function POST() {
  try {
    // 1. Get latest version from Data Dragon
    const version = await getLatestVersion();

    // 2. Fetch all data in parallel
    const [championData, itemData, runeData] = await Promise.all([
      getChampionData(version),
      getItemData(version),
      getRuneData(version),
    ]);

    // 3. Upsert champions
    let champCount = 0;
    for (const [, champ] of Object.entries(championData)) {
      const numericKey = parseInt(champ.key, 10);
      await db
        .insert(champions)
        .values({
          id: numericKey,
          key: champ.id,
          name: champ.name,
          title: champ.title,
          imageUrl: championImageUrl(version, champ.id),
          tags: champ.tags,
          patchVersion: version,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: champions.id,
          set: {
            key: champ.id,
            name: champ.name,
            title: champ.title,
            imageUrl: championImageUrl(version, champ.id),
            tags: champ.tags,
            patchVersion: version,
            updatedAt: new Date(),
          },
        });
      champCount++;
    }

    // 4. Upsert items
    let itemCount = 0;
    for (const [itemId, item] of Object.entries(itemData)) {
      const numericId = parseInt(itemId, 10);
      await db
        .insert(items)
        .values({
          id: numericId,
          name: item.name,
          description: item.description,
          imageUrl: itemImageUrl(version, numericId),
          gold: item.gold.total,
          tags: item.tags,
          patchVersion: version,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: items.id,
          set: {
            name: item.name,
            description: item.description,
            imageUrl: itemImageUrl(version, numericId),
            gold: item.gold.total,
            tags: item.tags,
            patchVersion: version,
            updatedAt: new Date(),
          },
        });
      itemCount++;
    }

    // 5. Upsert runes
    let runeCount = 0;
    for (const tree of runeData) {
      for (let slotIdx = 0; slotIdx < tree.slots.length; slotIdx++) {
        for (const rune of tree.slots[slotIdx].runes) {
          await db
            .insert(runes)
            .values({
              id: rune.id,
              name: rune.name,
              description: rune.shortDesc,
              imageUrl: rune.icon,
              treeId: tree.id,
              treeName: tree.name,
              slot: slotIdx,
              patchVersion: version,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: runes.id,
              set: {
                name: rune.name,
                description: rune.shortDesc,
                imageUrl: rune.icon,
                treeId: tree.id,
                treeName: tree.name,
                slot: slotIdx,
                patchVersion: version,
                updatedAt: new Date(),
              },
            });
          runeCount++;
        }
      }
    }

    // 6. Trigger stats aggregation
    // Extract major.minor from the version (e.g., "15.10.1" -> "15.10")
    const patchPrefix = version.split(".").slice(0, 2).join(".");
    const aggregatedCount = await aggregateChampionStats(patchPrefix);

    return NextResponse.json({
      success: true,
      version,
      champions: champCount,
      items: itemCount,
      runes: runeCount,
      aggregatedStats: aggregatedCount,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
