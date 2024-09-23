export const initializeHandlebars = () => {
    registerHandlebarsHelpers();
    preloadHandlebarsTemplates();
};

/**
 * Define a set of template paths to pre-load. Pre-loaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name.
 * @returns {Promise}
 */
function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/deathwatch/template/sheet/actor/acolyte.hbs",
        "systems/deathwatch/template/sheet/actor/npc.hbs",
        "systems/deathwatch/template/sheet/actor/limited-sheet.hbs",

        "systems/deathwatch/template/sheet/actor/tab/abilities.hbs",
        "systems/deathwatch/template/sheet/actor/tab/combat.hbs",
        "systems/deathwatch/template/sheet/actor/tab/gear.hbs",
        "systems/deathwatch/template/sheet/actor/tab/notes.hbs",
        "systems/deathwatch/template/sheet/actor/tab/npc-notes.hbs",
        "systems/deathwatch/template/sheet/actor/tab/npc-stats.hbs",
        "systems/deathwatch/template/sheet/actor/tab/progression.hbs",
        "systems/deathwatch/template/sheet/actor/tab/psychic-powers.hbs",
        "systems/deathwatch/template/sheet/actor/tab/stats.hbs",

        "systems/deathwatch/template/sheet/mental-disorder.hbs",
        "systems/deathwatch/template/sheet/aptitude.hbs",
        "systems/deathwatch/template/sheet/malignancy.hbs",
        "systems/deathwatch/template/sheet/mutation.hbs",
        "systems/deathwatch/template/sheet/talent.hbs",
        "systems/deathwatch/template/sheet/cohesionability.hbs",
        "systems/deathwatch/template/sheet/trait.hbs",
        "systems/deathwatch/template/sheet/special-ability.hbs",
        "systems/deathwatch/template/sheet/psychic-power.hbs",
        "systems/deathwatch/template/sheet/critical-injury.hbs",
        "systems/deathwatch/template/sheet/weapon.hbs",
        "systems/deathwatch/template/sheet/armour.hbs",
        "systems/deathwatch/template/sheet/gear.hbs",
        "systems/deathwatch/template/sheet/drug.hbs",
        "systems/deathwatch/template/sheet/tool.hbs",
        "systems/deathwatch/template/sheet/cybernetic.hbs",
        "systems/deathwatch/template/sheet/weapon-modification.hbs",
        "systems/deathwatch/template/sheet/ammunition.hbs",
        "systems/deathwatch/template/sheet/force-field.hbs",

        "systems/deathwatch/template/sheet/characteristics/information.hbs",
        "systems/deathwatch/template/sheet/characteristics/left.hbs",
        "systems/deathwatch/template/sheet/characteristics/name.hbs",
        "systems/deathwatch/template/sheet/characteristics/right.hbs",
        "systems/deathwatch/template/sheet/characteristics/total.hbs",

        "systems/deathwatch/template/chat/item.hbs",
        "systems/deathwatch/template/chat/roll.hbs",
        "systems/deathwatch/template/chat/damage.hbs",
        "systems/deathwatch/template/chat/critical.hbs",
        "systems/deathwatch/template/chat/evasion.hbs",
        "systems/deathwatch/template/chat/emptyMag.hbs",

        "systems/deathwatch/template/dialog/common-roll.hbs",
        "systems/deathwatch/template/dialog/combat-roll.hbs",
        "systems/deathwatch/template/dialog/psychic-power-roll.hbs"
    ];
    return loadTemplates(templatePaths);
}

/**
 * Add custom Handlerbars helpers.
 */
function registerHandlebarsHelpers() {
    Handlebars.registerHelper("removeMarkup", function(text) {
        const markup = /<(.*?)>/gi;
        return text.replace(markup, "");
    });

    Handlebars.registerHelper("enrich", function(string) {
        return TextEditor.enrichHTML(string, {async: false});
    });

    Handlebars.registerHelper("damageTypeLong", function(damageType) {
        damageType = (damageType || "i").toLowerCase();
        switch (damageType) {
            case "e":
                return game.i18n.localize("DAMAGE_TYPE.ENERGY");
            case "i":
                return game.i18n.localize("DAMAGE_TYPE.IMPACT");
            case "r":
                return game.i18n.localize("DAMAGE_TYPE.RENDING");
            case "x":
                return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE");
            default:
                return game.i18n.localize("DAMAGE_TYPE.IMPACT");
        }
    });


    Handlebars.registerHelper("damageTypeShort", function(damageType) {
        switch (damageType) {
            case "energy":
                return game.i18n.localize("DAMAGE_TYPE.ENERGY_SHORT");
            case "impact":
                return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
            case "rending":
                return game.i18n.localize("DAMAGE_TYPE.RENDING_SHORT");
            case "explosive":
                return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE_SHORT");
            default:
                return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
        }
    });

    Handlebars.registerHelper("config", function(key) {
        return game.deathWatch.config[key];
    });

}

