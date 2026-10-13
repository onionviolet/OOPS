// Item rarity colors per color scheme.
// Standard keeps the original upstream colors exactly. Vivid keeps each
// rarity's hue identity but lifts lightness so names read at >= 4.5:1 on every
// Vivid panel surface (trash gray, common white, uncommon green, rare blue,
// epic pink, legendary purple, mythical orange).

const STANDARD = Object.freeze({
    trash: "#d3d3d3",
    common: "#ffffff",
    uncommon: "#90ee90",
    rare: "#0000ff",
    epic: "#ffc0cb",
    legendary: "#800080",
    mythical: "#ffa500",
});

const VIVID = Object.freeze({
    trash: "#c8ccd4",
    common: "#ffffff",
    uncommon: "#7fe88f",
    rare: "#7fb2ff",
    epic: "#ff9ed1",
    legendary: "#d29bff",
    mythical: "#ffb04d",
});

const PALETTES = Object.freeze({standard: STANDARD, vivid: VIVID});

/**
 * @param {String} rarity trash/common/uncommon/rare/epic/legendary/mythical
 * @param {String} [scheme] color scheme id; unknown schemes use Standard
 * @returns {String} #rrggbb color
 */
function rarityColor(rarity, scheme) {
    const palette = PALETTES[scheme] || STANDARD;
    return palette[rarity] || STANDARD[rarity] || STANDARD.common;
}

export {rarityColor};
