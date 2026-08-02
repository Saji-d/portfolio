export interface ResearchPaper {
  slug: string;
  title: string;
  shortTitle: string;
  venue: string;
  year: string;
  summary: string;
  featured?: boolean;
  tags: string[];
  metrics?: { value: string; label: string }[];
}

export interface ResearchStudy {
  slug: string;
  title: string;
  field: string;
  oneLiner: string;
  summary: string;
  problem: string[];
  method: string[];
  baselines: { model: string; accuracy: string }[];
  features: { name: string; importance: string }[];
  metrics: { value: string; label: string }[];
  relatedSlugs: string[];
}

export const neuronscreen: ResearchStudy = {
  slug: "neuronscreen",
  title: "NeuroScreen",
  field: "ML · Deep Learning · Healthcare Informatics",
  oneLiner:
    "A hybrid CatBoost + ANN ensemble that detects cognitive impairment in insomniac university students — 95.20% accuracy, ROC-AUC 0.982.",
  summary:
    "Thesis (CSC 4298, Fall 2025–26). Dual-path training with arithmetic-mean probability blending beats every single model, showing that complementary learners can exceed either alone on survey-scale health data.",
  problem: [
    "Cognitive decline in university students is widely under-diagnosed — it is subtle, self-reported inconsistently, and screened too late.",
    "Single-model approaches (pure gradient boosting or pure deep learning) leave accuracy on the table, and survey data rewards a mix of both.",
  ],
  method: [
    "Built a custom survey dataset of 2,237 Bangladeshi university students (ages 20–35) across 7 cumulative cognitive-symptom categories, engineered and scaled into features.",
    "Dual-path training: CatBoost (GBDT) on the tabular side, and a 3-layer ANN (128-64-1 MLP, ReLU, Adam, dropout 0.3) on the deep side.",
    "Final decision = arithmetic mean of the two models' probabilities, evaluated on a stratified 80/20 split.",
  ],
  baselines: [
    { model: "NeuroScreen ensemble", accuracy: "95.20%" },
    { model: "CatBoost standalone", accuracy: "94.12%" },
    { model: "ANN standalone", accuracy: "91.25%" },
  ],
  features: [
    { name: "Mental / Physical Fatigue", importance: "0.095" },
    { name: "Stress Frequency", importance: "top-3" },
    { name: "GPA Impact", importance: "0.095" },
  ],
  metrics: [
    { value: "95.20%", label: "accuracy" },
    { value: "94.40%", label: "precision" },
    { value: "96.10%", label: "recall" },
    { value: "95.24%", label: "F1" },
    { value: "0.982", label: "ROC-AUC" },
    { value: "2,237", label: "survey responses" },
  ],
  relatedSlugs: ["finbert", "water-turbidity", "banglabert"],
};

export const researchPapers: ResearchPaper[] = [
  {
    slug: "neuronscreen",
    title: "Neuro-Screen: A Hybrid ML and DL Ensemble Framework for Detection of Cognitive Impairment in Insomniac University Students",
    shortTitle: "NeuroScreen (Thesis)",
    venue: "Thesis · CSC 4298",
    year: "2025–26",
    summary:
      "CatBoost + ANN ensemble blending on a 2,237-student survey dataset. 95.20% accuracy, 0.982 ROC-AUC.",
    featured: true,
    tags: ["ML", "Deep Learning", "Healthcare"],
    metrics: [
      { value: "95.20%", label: "accuracy" },
      { value: "0.982", label: "ROC-AUC" },
    ],
  },
  {
    slug: "water-turbidity",
    title: "Improving Generalization of Image-Based Water Turbidity Classification Using Fine-Tuning with Small Real-World Datasets",
    shortTitle: "Water Turbidity (CVPR paper)",
    venue: "Computer Vision & Pattern Recognition",
    year: "2025",
    summary:
      "EfficientNet-B0 + transfer learning on ~300 self-collected phone photos, with auxiliary cat/dog/panda data to fight overfitting.",
    tags: ["Computer Vision", "Transfer Learning"],
  },
  {
    slug: "banglabert",
    title: "Explainable Bangla Toxic Comment Detection using BanglaBERT with SHAP and LIME",
    shortTitle: "BanglaBERT Explainable Toxicity",
    venue: "Data Mining (IEEE format)",
    year: "2025",
    summary:
      "BanglaBERT with SHAP + LIME explanations, k-fold (5) and 70/15/15 splits across multiple Bangla toxicity datasets.",
    tags: ["NLP", "Explainable AI"],
  },
  {
    slug: "finbert",
    title: "Financial Sentiment Analysis with Fine-Tuned Transformers",
    shortTitle: "FinBERT Sentiment",
    venue: "NLP course research",
    year: "2025",
    summary:
      "Fine-tuned FinBERT vs vanilla BERT on financial text — why domain-specific transformers win on jargon-heavy corpora.",
    tags: ["NLP", "Transformers"],
  },
  {
    slug: "interactout",
    title: "Adaptive InteractOut: A Context-Aware, Personalized Intervention for Smartphone Overuse",
    shortTitle: "HCI Paper",
    venue: "Human–Computer Interaction",
    year: "2025",
    summary:
      "Context-aware intervention design for smartphone overuse — group paper and poster.",
    tags: ["HCI"],
  },
  {
    slug: "rm-paper",
    title: "Entrepreneurship Over Employment: Guiding Bangladeshi Youth Towards Innovation and Self-Reliance",
    shortTitle: "Research Methodology",
    venue: "Research Methodology",
    year: "2025",
    summary:
      "A study on the drivers of entrepreneurship among Bangladeshi youth.",
    tags: ["RM"],
  },
];
