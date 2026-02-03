export function computeTargets({age, height, weight, sex, activity, goal}) {
  const bmr = sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const af = { low: 1.2, medium: 1.55, high: 1.75 }[activity] || 1.2;
  let calories = bmr * af;
  if (goal === 'loss') calories *= 0.8;
  if (goal === 'gain') calories *= 1.1;

  const protein = Math.round(weight * 2);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return { calories: Math.round(calories), protein, fat, carbs };
}

export function dailyPlan(targets) {
  return {
    totals: targets,
    meals: [
      { time: "07:30", name: "Oats + Protein", portion: "1 bowl" },
      { time: "12:30", name: "Chicken, Rice, Veg", portion: "1 plate" },
      { time: "16:30", name: "Greek Yogurt + Fruit", portion: "1 cup" },
      { time: "19:30", name: "Fish + Potatoes", portion: "1 plate" }
    ]
  };
}

export function weeklyPlan(targets) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const plan = {};
  for (const d of days) plan[d] = dailyPlan(targets);
  return plan;
}

export function evaluateFood({barcode, context}) {
  // Mock food DB
  const mock = {
    "0001": { name: "Protein Bar", calories: 200, sugar: 6, protein: 20 },
    "0002": { name: "Sugary Cereal", calories: 250, sugar: 22, protein: 6 }
  };
  const item = mock[barcode] || { name: "Unknown Food", calories: 300, sugar: 15, protein: 8 };
  let verdict = "Occasional";
  let bestTime = "Post-workout";
  if (item.sugar > 20) verdict = "Avoid";
  if (item.protein >= 15 && item.sugar <= 10) verdict = "Recommended";

  return {
    item,
    verdict,
    bestTime,
    portion: verdict === "Avoid" ? "Avoid today" : "1 serving",
    alternatives: verdict === "Avoid" ? ["Greek yogurt", "Fruit + nuts"] : []
  };
}
