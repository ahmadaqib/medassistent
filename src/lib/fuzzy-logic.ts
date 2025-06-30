/**
 * @fileOverview Fuzzy Logic algorithm for referral recommendation.
 * This file contains the functions to calculate a referral score based on fuzzy logic principles.
 * It includes fuzzification, rule evaluation, and defuzzification steps.
 */

// Represents the degree of membership for a fuzzy set.
interface FuzzySet {
    low: number;
    medium: number;
    high: number;
}

// Input scores for the fuzzy logic calculation.
export interface FuzzyInput {
    clinicalScore: number;
    insuranceScore: number;
    personalPreferenceScore: number;
}

// Output from the fuzzy logic calculation.
export interface FuzzyResult {
    score: number;
    level: 'Rendah' | 'Sedang' | 'Tinggi';
}

/**
 * A triangular membership function.
 * @param x The crisp input value.
 * @param a The start of the triangle.
 * @param b The peak of the triangle.
 * @param c The end of the triangle.
 * @returns The degree of membership (0 to 1).
 */
function triangularMembership(x: number, a: number, b: number, c: number): number {
    if (x <= a || x >= c) return 0;
    if (x > a && x <= b) return (x - a) / (b - a);
    if (x > b && x < c) return (c - x) / (c - b);
    return 0;
}

/**
 * Fuzzifies the crisp input scores into fuzzy sets.
 * @param input The crisp input scores.
 * @returns An object containing the fuzzy sets for each criterion.
 */
function fuzzify(input: FuzzyInput): { clinical: FuzzySet; insurance: FuzzySet; personal: FuzzySet } {
    return {
        clinical: {
            low: triangularMembership(input.clinicalScore, 0, 25, 50),
            medium: triangularMembership(input.clinicalScore, 25, 50, 75),
            high: triangularMembership(input.clinicalScore, 50, 75, 100),
        },
        insurance: {
            low: triangularMembership(input.insuranceScore, 0, 25, 50),
            medium: triangularMembership(input.insuranceScore, 25, 50, 75),
            high: triangularMembership(input.insuranceScore, 50, 75, 100),
        },
        personal: {
            low: triangularMembership(input.personalPreferenceScore, 0, 25, 50),
            medium: triangularMembership(input.personalPreferenceScore, 25, 50, 75),
            high: triangularMembership(input.personalPreferenceScore, 50, 75, 100),
        },
    };
}

/**
 * Applies a set of fuzzy rules to determine the output fuzzy set for referral priority.
 * @param fuzzified The fuzzified input sets.
 * @returns A fuzzy set representing the referral priority.
 */
function applyRules(fuzzified: { clinical: FuzzySet; insurance: FuzzySet; personal: FuzzySet }): FuzzySet {
    const priority: FuzzySet = { low: 0, medium: 0, high: 0 };

    // Rule 1: IF clinical is high OR personal is high THEN priority is high
    const rule1 = Math.max(fuzzified.clinical.high, fuzzified.personal.high);
    priority.high = Math.max(priority.high, rule1);

    // Rule 2: IF clinical is medium AND insurance is high THEN priority is medium
    const rule2 = Math.min(fuzzified.clinical.medium, fuzzified.insurance.high);
    priority.medium = Math.max(priority.medium, rule2);
    
    // Rule 3: IF clinical is high AND insurance is low THEN priority is medium
    const rule3 = Math.min(fuzzified.clinical.high, fuzzified.insurance.low);
    priority.medium = Math.max(priority.medium, rule3);

    // Rule 4: IF personal is medium and clinical is medium THEN priority is medium
    const rule4 = Math.min(fuzzified.personal.medium, fuzzified.clinical.medium);
    priority.medium = Math.max(priority.medium, rule4);

    // Rule 5: IF clinical is low THEN priority is low
    const rule5 = fuzzified.clinical.low;
    priority.low = Math.max(priority.low, rule5);

    // Rule 6: IF personal is low and insurance is medium THEN priority is low
    const rule6 = Math.min(fuzzified.personal.low, fuzzified.insurance.medium);
    priority.low = Math.max(priority.low, rule6);

    // Rule 7: IF insurance is low and clinical is medium THEN priority is low
    const rule7 = Math.min(fuzzified.insurance.low, fuzzified.clinical.medium);
    priority.low = Math.max(priority.low, rule7);
    
    // Rule 8: If Clinical is high AND Insurance is high AND Personal is high, priority is very high
    const rule8 = Math.min(fuzzified.clinical.high, fuzzified.insurance.high, fuzzified.personal.high);
    priority.high = Math.max(priority.high, rule8);
    
    // Rule 9: If all are medium, priority is medium
    const rule9 = Math.min(fuzzified.clinical.medium, fuzzified.insurance.medium, fuzzified.personal.medium);
    priority.medium = Math.max(priority.medium, rule9);
    
    // Rule 10: If all are low, priority is low
    const rule10 = Math.min(fuzzified.clinical.low, fuzzified.insurance.low, fuzzified.personal.low);
    priority.low = Math.max(priority.low, rule10);

    return priority;
}

/**
 * Defuzzifies the output fuzzy set into a crisp score using the Center of Gravity method.
 * @param priority The output fuzzy set for priority.
 * @returns An object with the crisp score and its corresponding level.
 */
function defuzzify(priority: FuzzySet): FuzzyResult {
    const centers = { low: 25, medium: 50, high: 80 }; // Representative crisp value for each fuzzy set
    
    const numerator = (priority.low * centers.low) + (priority.medium * centers.medium) + (priority.high * centers.high);
    const denominator = priority.low + priority.medium + priority.high;

    if (denominator === 0) {
        return { score: 50, level: 'Sedang' }; // Return a neutral default if no rules fired
    }

    const score = Math.round(numerator / denominator);
    let level: 'Rendah' | 'Sedang' | 'Tinggi';

    if (score < 40) {
        level = 'Rendah';
    } else if (score >= 40 && score < 70) {
        level = 'Sedang';
    } else {
        level = 'Tinggi';
    }

    return { score, level };
}

/**
 * The main function to calculate the referral recommendation using Fuzzy Logic.
 * @param input The crisp input scores for a patient.
 * @returns The final fuzzy logic result.
 */
export function calculateFuzzyRecommendation(input: FuzzyInput): FuzzyResult {
    const fuzzifiedValues = fuzzify(input);
    const ruleEvaluation = applyRules(fuzzifiedValues);
    const result = defuzzify(ruleEvaluation);
    return result;
}
