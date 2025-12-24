// lib/matchPlanningView.js

export function buildPlayerMaps(playersByTeamId, teamId) {
    const players = playersByTeamId?.[teamId] || [];
    const playerById = Object.fromEntries(players.map((p) => [p.id, p]));
    return { players, playerById };
}

export function getSlotCount(playersByTeamId, teamId, maxSlots = 7) {
    const count = playersByTeamId?.[teamId]?.length ?? 0;
    return Math.min(count, maxSlots);
}

/**
 * Returns lineup rows:
 * [{ slot: 1, playerId, name, teamPosition }, ...]
 *
 * - slot count based on number of players in the team
 * - slot pulls player_id from plan.position1..position7
 */
export function buildLineup({ teamId, playersByTeamId, planByTeamId, maxSlots = 7 }) {
    const { playerById } = buildPlayerMaps(playersByTeamId, teamId);
    const plan = planByTeamId?.[teamId] || {};

    const slotCount = getSlotCount(playersByTeamId, teamId, maxSlots);

    const lineup = [];
    for (let slot = 1; slot <= slotCount; slot++) {
        const playerId = plan[`position${slot}`] ?? null;
        const p = playerId ? playerById[playerId] : null;

        lineup.push({
            slot,
            playerId,
            name: p?.name ?? null,
            teamPosition: p?.position ?? null, // roster position 1..5
        });
    }

    return lineup;
}
export function buildOrderedPlayers({ teamId, playersByTeamId, planByTeamId, maxSlots = 7 }) {
    const players = playersByTeamId?.[teamId] || [];
    const playerById = Object.fromEntries(players.map((p) => [p.id, p]));
    const slotCount = Math.min(players.length, maxSlots);

    const plan = planByTeamId?.[teamId] || {};

    const ordered = [];
    for (let slot = 1; slot <= slotCount; slot++) {
        const pid = plan[`position${slot}`];
        if (pid && playerById[pid]) ordered.push(playerById[pid]);
    }

    // Fill any missing players if plan is partially empty
    const used = new Set(ordered.map((p) => p.id));
    for (const p of players) {
        if (!used.has(p.id) && ordered.length < slotCount) ordered.push(p);
    }

    return ordered; // [{id, name, position, team_id}, ...]
}