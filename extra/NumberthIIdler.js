import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "my_custom_theory_id";
var name = "My Custom Theory";
var description = "Use this four currency \n(numbrth tree (from prestige tree)!)";
var authors = "Karen";
var version = 1;

var currency, currency_ZERO;
var prestige, doublegain;
var prestigeExp, doublegainExp;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency("P", "P")
    currency_ZERO = theory.createCurrency("0", "0");
    currency_ONE = theory.createCurrency("1", "1")
    currency_TWO = theory.createCurrency("2", "2")

    ///////////////////
    // Regular Upgrades

    // prestige
    {
        let getDesc = (level) => "prestige=" + getPRESTIGE(level).toString(0);
        prestige = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        prestige.getDescription = (_) => Utils.getMath(getDesc(prestige.level));
        prestige.getInfo = (amount) => Utils.getMathTo(getDesc(prestige.level), getDesc(c1.level + amount));
    }

    // doublegain
    {
        let getDesc = (level) => "doublegain=2^{" + level + "}";
        let getInfo = (level) => "doublegain=" + getDOUBLEGAIN(level).toString(0);
        doublegain = theory.createUpgrade(1, currency_ZERO, new ExponentialCost(1e3, Math.log2(1e6)));
        doublegain.getDescription = (_) => Utils.getMath(getDesc(doublegain.level));
        doublegain.getInfo = (amount) => Utils.getMathTo(getInfo(doublegain.level), getInfo(doublegain.level + amount));
        doublegain.maxLevel = 2;
    }

    // ones
    {
        let getDesc = (level) => "ones=2^{" + level + "}";
        let getInfo = (level) => "ones=" + getONES(level).toString(0);
        ones = theory.createUpgrade(2, currency_ZERO, new ExponentialCost(1e300, Math.log2(1e300)));
        ones.getDescription = (_) => Utils.getMath(getDesc(ones.level));
        ones.getInfo = (amount) => Utils.getMathTo(getInfo(ones.level), getInfo(ones.level + amount));
    }

    // triplegain
    {
        let getDesc = (level) => "triplegain=3^{" + level + "}";
        let getInfo = (level) => "triplegain=" + getONES(level).toString(0);
        triplegain = theory.createUpgrade(3, currency_ONE, new ExponentialCost(1e6, Math.log2(1e2)));
        triplegain.getDescription = (_) => Utils.getMath(getDesc(triplegain.level));
        triplegain.getInfo = (amount) => Utils.getMathTo(getInfo(triplegain.level), getInfo(triplegain.level + amount));
        triplegain.maxLevel = 1;
    }

    // pubpower
    {
        let getDesc = (level) => "pubpower=pub^{" + level + "}";
        let getInfo = (level) => "pubpower=" + getONES(level).toString(0);
        pubpower = theory.createUpgrade(4, currency_ONE, new ExponentialCost(1e20, Math.log2(1e5)));
        pubpower.getDescription = (_) => Utils.getMath(getDesc(pubpower.level));
        pubpower.getInfo = (amount) => Utils.getMathTo(getInfo(pubpower.level), getInfo(pubpower.level + amount));
        pubpower.maxLevel = 3;
    }

    // twos
    {
        let getDesc = (level) => "twos=2^{" + level + "}";
        let getInfo = (level) => "twos=" + getTWOS(level).toString(0);
        twos = theory.createUpgrade(5, currency_ONE, new ExponentialCost(1e300, Math.log2(1e300)));
        twos.getDescription = (_) => Utils.getMath(getDesc(twos.level));
        twos.getInfo = (amount) => Utils.getMathTo(getInfo(twos.level), getInfo(twos.level + amount));
    }


    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(5, 5));

    {
        prestigeExp = theory.createMilestoneUpgrade(0, 3);
        prestigeExp.description = Localization.getUpgradeIncCustomExpDesc("prestige", "0.05");
        prestigeExp.info = Localization.getUpgradeIncCustomExpInfo("prestige", "0.05");
        prestigeExp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        doublegainExp = theory.createMilestoneUpgrade(1, 3);
        doublegainExp.description = Localization.getUpgradeIncCustomExpDesc("doublegain", "0.05");
        doublegainExp.info = Localization.getUpgradeIncCustomExpInfo("doublegain", "0.05");
        doublegainExp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "Numberth", "Start to Playing!", () => prestige.level > 0);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0);

    updateAvailability();
}

var updateAvailability = () => {
    doublegainExp.isAvailable = prestigeExp.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    let bouns2 = theory.publicationMultiplier;
    currency_ZERO.value += getONES(ones.level);
    currency_TWO.value = getTWOS(twos.level) * BigNumber.TWO;
    currency_ONE.value = getONES(ones.level) * tau.publicationMultiplier.log10(dt);
    currency_ZERO.value = getPRESTIGE(prestige.level) * getTRIPLEGAIN(triplegain.level);
    currency.value += 1 * bonus * bouns2 * currency_ZERO.value * getPRESTIGE(prestige.level) * getDOUBLEGAIN(doublegain.level) * getTRIPLEGAIN(triplegain) * getPUBLICATIONPOWER(pubpower.level);
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = prestige";

    if (prestigeExp.level == 1) result += "^{1.05}";
    if (prestigeExp.level == 2) result += "^{1.1}";
    if (prestigeExp.level == 3) result += "^{1.15}";

    result += "doublegain";

    if (doublegainExp.level == 1) result += "^{1.05}";
    if (doublegainExp.level == 2) result += "^{1.1}";
    if (doublegainExp.level == 3) result += "^{1.15}";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getPRESTIGE = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getDOUBLEGAIN = (level) => BigNumber.TWO.pow(level);
var getONES = (level) => BigNumber.TWO.pow(level);
var getTRIPLEGAIN = (level) => BigNumber.THREE.pow(level);
var getPUBLICATIONPOWER = (level) => theory.publicationMultiplier.pow(level);
var getTWOS = (level) => BigNumber.TWO.pow(level);
var getPRESTIGEExponent = (level) => BigNumber.from(1 + 0.05 * level);
var getDOUBLEGAINExponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
