import { DeathWatchActor } from "./common/actor.js";
import { DeathWatchItem } from "./common/item.js";
import { AcolyteSheet } from "./sheet/actor/acolyte.js";
import { NpcSheet } from "./sheet/actor/npc.js";
import { WeaponSheet } from "./sheet/weapon.js";
import { AmmunitionSheet } from "./sheet/ammunition.js";
import { WeaponModificationSheet } from "./sheet/weapon-modification.js";
import { ArmourSheet } from "./sheet/armour.js";
import { ForceFieldSheet } from "./sheet/force-field.js";
import { CyberneticSheet } from "./sheet/cybernetic.js";
import { DrugSheet } from "./sheet/drug.js";
import { GearSheet } from "./sheet/gear.js";
import { ToolSheet } from "./sheet/tool.js";
import { CriticalInjurySheet } from "./sheet/critical-injury.js";
import { MalignancySheet } from "./sheet/malignancy.js";
import { MentalDisorderSheet } from "./sheet/mental-disorder.js";
import { MutationSheet } from "./sheet/mutation.js";
import { PsychicPowerSheet } from "./sheet/psychic-power.js";
import { TalentSheet } from "./sheet/talent.js";
import { SpecialAbilitySheet } from "./sheet/special-ability.js";
import { TraitSheet } from "./sheet/trait.js";
import { AptitudeSheet } from "./sheet/aptitude.js";
import { initializeHandlebars } from "./common/handlebars.js";
import { migrateWorld } from "./common/migration.js";
import { prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll } from "./common/dialog.js";
import { commonRoll, combatRoll } from "./common/roll.js";
import { chatListeners } from "./common/chat.js";
import DhMacroUtil from "./common/macro.js";
import Dh from "./common/config.js";

// Import Helpers
import * as chat from "./common/chat.js";

Hooks.once("init", function() {
    CONFIG.Combat.initiative = { formula: "@initiative.base + @initiative.bonus", decimals: 0 };
    CONFIG.Actor.documentClass = DeathWatchActor;
    CONFIG.Item.documentClass = DeathWatchItem;
    CONFIG.fontDefinitions["Caslon Antique"] = {editor: true, fonts: []};
    game.deathWatch = {
        config: Dh,
        testInit: {
            prepareCommonRoll,
            prepareCombatRoll,
            preparePsychicPowerRoll
        },
        tests: {
            commonRoll,
            combatRoll
        }
    };
    game.macro = DhMacroUtil;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("deathwatch", AcolyteSheet, { types: ["acolyte"], makeDefault: true });
    Actors.registerSheet("deathwatch", NpcSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("deathwatch", WeaponSheet, { types: ["weapon"], makeDefault: true });
    Items.registerSheet("deathwatch", AmmunitionSheet, { types: ["ammunition"], makeDefault: true });
    Items.registerSheet("deathwatch", WeaponModificationSheet, { types: ["weaponModification"], makeDefault: true });
    Items.registerSheet("deathwatch", ArmourSheet, { types: ["armour"], makeDefault: true });
    Items.registerSheet("deathwatch", ForceFieldSheet, { types: ["forceField"], makeDefault: true });
    Items.registerSheet("deathwatch", CyberneticSheet, { types: ["cybernetic"], makeDefault: true });
    Items.registerSheet("deathwatch", DrugSheet, { types: ["drug"], makeDefault: true });
    Items.registerSheet("deathwatch", GearSheet, { types: ["gear"], makeDefault: true });
    Items.registerSheet("deathwatch", ToolSheet, { types: ["tool"], makeDefault: true });
    Items.registerSheet("deathwatch", CriticalInjurySheet, { types: ["criticalInjury"], makeDefault: true });
    Items.registerSheet("deathwatch", MalignancySheet, { types: ["malignancy"], makeDefault: true });
    Items.registerSheet("deathwatch", MentalDisorderSheet, { types: ["mentalDisorder"], makeDefault: true });
    Items.registerSheet("deathwatch", MutationSheet, { types: ["mutation"], makeDefault: true });
    Items.registerSheet("deathwatch", PsychicPowerSheet, { types: ["psychicPower"], makeDefault: true });
    Items.registerSheet("deathwatch", TalentSheet, { types: ["talent"], makeDefault: true });
    Items.registerSheet("deathwatch", SpecialAbilitySheet, { types: ["specialAbility"], makeDefault: true });
    Items.registerSheet("deathwatch", TraitSheet, { types: ["trait"], makeDefault: true });
    Items.registerSheet("deathwatch", AptitudeSheet, { types: ["aptitude"], makeDefault: true });

    initializeHandlebars();

    game.settings.register("deathwatch", "worldSchemaVersion", {
        name: "World Version",
        hint: "Used to automatically upgrade worlds data when the system is upgraded.",
        scope: "world",
        config: true,
        default: 0,
        type: Number
    });
    game.settings.register("deathwatch", "autoCalcXPCosts", {
        name: "Calculate XP Costs",
        hint: "If enabled, calculate XP costs automatically.",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register("deathwatch", "useSpraytemplate", {
        name: "Use Template with Spray Weapons",
        hint: "If enabled, Spray Weapons will require the user to put down a template before the roll is made. Templates are NOT removed automatically",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });

});

Hooks.once("ready", function() {
    migrateWorld();
    CONFIG.ChatMessage.documentClass.prototype.getRollData = function() {
        return this.getFlag("deathwatch", "rollData");
    };
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

/** Add Event Listeners for Buttons on chat boxes */
Hooks.once("renderChatLog", (chat, html) => {
    chatListeners(html);
});

/** Add Options to context Menu of chatmessages */
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);

/**
 * Create a macro when dropping an entity on the hotbar
 * Item      - open roll dialog for item
 */
Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type === "Item" || data.type === "Actor")
    {
        DhMacroUtil.createMacro(data, slot);
        return false;
    }
});

Hooks.on("renderDeathWatchSheet", (sheet, html, data) => {
    html.find("input.cost").prop("disabled", game.settings.get("deathwatch", "autoCalcXPCosts"));
    html.find(":not(.psychic-power) > input.item-cost").prop("disabled", game.settings.get("deathwatch", "autoCalcXPCosts"));
});
