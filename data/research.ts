export interface ResearchMetric {
  value: string;
  label: string;
}

export interface ResearchStudy {
  slug: string;
  title: string;
  shortTitle: string;
  field: string;
  featured?: boolean;
  tags: string[];
  oneLiner: string;
  summary: string;
  metrics?: ResearchMetric[];
}

export const neuronscreen: ResearchStudy = {
  slug: "neuronscreen",
  title:
    "Neuro-Screen: A Hybrid Ensemble Framework for Detection of Cognitive Impairment in Insomniac University Students",
  shortTitle: "NeuroScreen (Thesis)",
  field: "Undergraduate Thesis · Healthcare ML / DL",
  featured: true,
  tags: ["Machine Learning", "Deep Learning", "Healthcare AI", "CatBoost", "ANN"],
  oneLiner:
    "A CatBoost + ANN hybrid ensemble that detects cognitive impairment in insomniac university students: 95.20% accuracy, 0.982 ROC-AUC.",
  summary:
    "Thesis that fuses a gradient-boosting classifier with a three-layer neural network by averaging their probability outputs. Trained on 2,237 survey responses from students aged 20–35, the ensemble beats every standalone model across all metrics and pinpoints the lifestyle factors that most strongly predict cognitive decline.",
  metrics: [
    { value: "95.20%", label: "accuracy" },
    { value: "94.40%", label: "precision" },
    { value: "96.10%", label: "recall" },
    { value: "95.24%", label: "F1" },
    { value: "0.982", label: "ROC-AUC" },
    { value: "2,237", label: "survey responses" },
  ],
};

export const researchPapers: ResearchStudy[] = [
  neuronscreen,
  {
    slug: "twitter-sentiment",
    title: "Twitter Sentiment Analysis with TF-IDF and Multinomial Naïve Bayes",
    shortTitle: "Twitter Sentiment (NLP)",
    field: "Natural Language Processing",
    tags: ["Natural Language Processing", "Machine Learning"],
    oneLiner:
      "A classical NLP pipeline on 200k balanced tweets: TF-IDF (10k unigrams + bigrams) into Multinomial Naïve Bayes, 74.84% accuracy.",
    summary:
      "Course research on the Sentiment140 corpus. 1.6M tweets are balanced down to 200k (100k positive + 100k negative), run through a deep preprocessing chain: lowercasing, URL/@/# removal, punctuation stripping, stopword removal, WordNet synonym substitution, Porter stemming, and lemmatization, then vectorized with TF-IDF and classified by Multinomial Naïve Bayes on a stratified 80/20 split.",
    metrics: [
      { value: "74.84%", label: "accuracy" },
      { value: "200,000", label: "balanced tweets" },
      { value: "10,000", label: "TF-IDF features" },
      { value: "40,000", label: "test tweets" },
    ],
  },
  {
    slug: "early-warning-customer-churn",
    title: "Early Warning Model for High-Value Customer Drop-Off",
    shortTitle: "Early Warning Customer Churn (Data Science)",
    field: "Data Science · Customer Analytics",
    tags: ["Machine Learning", "Predictive Analytics", "Business Intelligence"],
    oneLiner:
      "RFM profiling plus clustering (KMeans++, BisectingKMeans, GMM) on the Online Retail dataset isolates 776 high-value customers, and a Random Forest flags drop-off risk with 0.788 ROC-AUC.",
    summary:
      "Course research in Data Science. Cleans 541,909 transactions into a 4,338-customer RFM matrix, segments customers with unsupervised clustering compared across three algorithms, then builds a supervised early-warning classifier on month-over-month RFM decay to flag high-value customers at risk of churn.",
    metrics: [
      { value: "4,338", label: "customers" },
      { value: "776", label: "high-value segment" },
      { value: "1,917", label: "early-warning signals" },
      { value: "0.788", label: "ROC-AUC" },
    ],
  },
  {
    slug: "water-turbidity",
    title:
      "Improving Generalization of Image-Based Water Turbidity Classification Using Fine-Tuning with Small Real-World Datasets",
    shortTitle: "Water Turbidity (CVPR paper)",
    field: "Computer Vision & Pattern Recognition",
    tags: ["Computer Vision", "Deep Learning", "Transfer Learning"],
    oneLiner:
      "EfficientNet-B0 with partial fine-tuning on 300+ self-collected phone photos tries to classify turbidity from uncontrolled real-world images, an honest look at how hard field generalization is.",
    summary:
      "Course paper that tackles image-based turbidity classification with a small custom dataset of 300+ photos taken on three different smartphones in natural, uncontrolled lighting. An ImageNet-pretrained EfficientNet-B0 with partial fine-tuning learns to separate Low / Medium / High turbidity, and the paper candidly reports the limits of doing so from photos alone.",
    metrics: [
      { value: "300+", label: "real-world images" },
      { value: "3", label: "turbidity classes" },
      { value: "EfficientNet-B0", label: "backbone" },
      { value: "224×224", label: "input size" },
    ],
  },
  {
    slug: "banglabert",
    title: "Explainable Bangla Toxic Comment Detection using BanglaBERT with SHAP and LIME",
    shortTitle: "BanglaBERT Explainable Toxicity",
    field: "Data Warehouse & Data Mining",
    tags: ["Natural Language Processing", "BERT", "Transformers", "Explainable AI"],
    oneLiner:
      "A fine-tuned BanglaBERT detects toxic Bengali comments (86% accuracy, 87% F1, 0.91 ROC-AUC) and explains every prediction with SHAP and LIME.",
    summary:
      "Data-mining research (IEEE-format paper) that fine-tunes BanglaBERT on Bengali toxicity data using 5-fold stratified cross-validation and adds an explainability layer: SHAP and LIME reveal which words drove each toxic / non-toxic decision, tackling the black-box problem in low-resource Bangla NLP.",
    metrics: [
      { value: "86%", label: "accuracy" },
      { value: "87%", label: "F1-score" },
      { value: "0.91", label: "ROC-AUC" },
      { value: "5-fold", label: "stratified CV" },
    ],
  },
];

export function getResearch(slug: string) {
  return researchPapers.find((p) => p.slug === slug);
}
