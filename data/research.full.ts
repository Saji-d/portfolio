import type { ResearchMetric } from "@/data/research";

export type { ResearchMetric } from "@/data/research";

export interface ResearchModel {
  name: string;
  role: string;
}

export interface ResearchBaseline {
  model: string;
  accuracy: string;
}

export interface ResearchFeature {
  name: string;
  importance: string;
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
  github?: string;
  live?: string;
  overview: string[];
  problem: string[];
  objective: string[];
  methodology: string[];
  models: ResearchModel[];
  dataset: string[];
  implementation: string[];
  keyFeatures: string[];
  results: ResearchMetric[];
  resultNotes: string[];
  outcome: string[];
  tools: string[];
  challenges: string[];
  futureWork: string[];
  relatedSlugs: string[];
  baselines?: ResearchBaseline[];
  featureImportance?: ResearchFeature[];
  thesisCta?: boolean;
}

export const neuronscreen: ResearchStudy = {
  slug: "neuronscreen",
  title:
    "Neuro-Screen: Evaluating Stacked Ensemble for Predicting Cognitive Symptoms in University Students at Sleep Risk",
  shortTitle: "Neuro-Screen",
  field: "Group Research Project (AIUB) · Applied ML",
  featured: true,
  tags: ["Machine Learning", "Healthcare AI", "Stacked Ensemble", "Nested Cross-Validation", "CatBoost", "XGBoost", "LightGBM", "PyTorch"],
  github: "https://github.com/Saji-d/neuro-screen",
  live: "https://neuro-screen.streamlit.app/",
  oneLiner:
    "A leakage-controlled, rigorously evaluated stacked-ensemble study on sleep and cognitive symptoms in 2,236 student survey responses, with a Streamlit prototype.",
  summary:
    "Group research project at AIUB (paper forthcoming). I built the Streamlit app and ran the re-analysis. A stack of CatBoost, XGBoost, LightGBM and a PyTorch ANN is evaluated with nested cross-validation on a leakage-controlled predictor set, with metrics reported against a majority-class baseline.",
  metrics: [
    { value: "2,236", label: "survey responses" },
    { value: "5x3", label: "nested cross-validation" },
  ],
  overview: [
    "Neuro-Screen asks whether routine survey answers (sleep habits, caffeine, screen use, stress, workload) can identify university students who report elevated cognitive symptoms. It is a leakage-controlled evaluation of a stacked ensemble on 2,236 survey responses.",
    "The analysis excludes all nine outcome-defining questionnaire items (two sleep items and seven cognitive-symptom items), uses 12 remaining predictors, and evaluates the stack with nested cross-validation against a majority-class baseline.",
    "The work was a group research project at AIUB; the paper is forthcoming. I built the Streamlit app and ran the re-analysis.",
  ],
  problem: [
    "Sleep difficulties and stress are associated with self-reported cognitive symptoms in students, which makes a short-survey screener an appealing idea to evaluate.",
    "A careful design matters here: the cognitive score is computed from raw questionnaire answers, so those answers have to be kept out of the predictors for the evaluation to be meaningful.",
  ],
  objective: [
    "Evaluate whether 12 demographic, behavioural and academic survey variables can predict elevated cognitive symptoms among students who meet a questionnaire-defined sleep-risk rule (primary task), and sleep risk in the full sample (secondary task).",
    "Compare the four-model stack with each standalone model and a majority-class baseline on the same validation folds.",
    "Report the metrics transparently under a leakage-controlled design.",
  ],
  methodology: [
    "Data: 2,236 survey responses from Bangladeshi university students. 1,692 (75.7%) meet the sleep-risk rule and enter the cognitive analysis.",
    "Leakage control: all nine outcome-defining questionnaire items are excluded from the predictors. The 12 predictors are age, gender, university, year of study, caffeine intake, device use in bed, perceived cognitive load, stress frequency, night awakenings, missed deadlines, perceived effect of sleep deprivation on GPA and interference of fatigue with daily goals.",
    "Stack: a regularized logistic regression over the out-of-fold probabilities of CatBoost, XGBoost, LightGBM and a PyTorch ANN (128-64 hidden units).",
    "Validation: 5 outer folds, with 3 inner folds inside each outer training partition to generate the out-of-fold predictions. The cognitive-symptom cutoff (72nd percentile of the total score) is estimated from training data only.",
    "Statistics: fold-wise exact McNemar tests against each standalone model with Holm correction across 40 comparisons, treated as exploratory.",
  ],
  models: [
    { name: "CatBoost", role: "Gradient-boosted trees with native categorical handling; 800 iterations, depth 5." },
    { name: "XGBoost", role: "Gradient-boosted trees on one-hot features; 180 iterations, depth 3." },
    { name: "LightGBM", role: "Gradient-boosted trees on one-hot features; 180 iterations, up to 15 leaves." },
    { name: "ANN (PyTorch)", role: "Two hidden layers (128, 64) with dropout, trained for 40 epochs." },
    { name: "Logistic regression stack", role: "Combines the four models' out-of-fold probabilities into the final prediction." },
  ],
  dataset: [
    "2,236 cross-sectional survey responses from university students in Bangladesh.",
    "Sleep risk is defined from self-reported sleep duration and quality. The cognitive outcome is the sum of seven symptom items (0 to 17), thresholded at a training-fold percentile.",
  ],
  implementation: [
    "Python analysis with scikit-learn, CatBoost, XGBoost, LightGBM and PyTorch. All preprocessing is fitted inside each training partition.",
    "Streamlit app with a five-step assessment wizard, a results page that lists the reasons behind each estimate and a Reliability page that shows the cross-validation results against the majority baseline.",
    "No answers are stored. The app is labelled a research prototype and not a medical device.",
  ],
  keyFeatures: [
    "Leakage-controlled design: all nine outcome-defining items are excluded from the predictors.",
    "Nested cross-validation with out-of-fold stacking, so the meta-model never sees its own base-model training data.",
    "Majority-class baseline and standalone comparators on identical folds.",
    "A Streamlit prototype with a Reliability page that shows the cross-validation results.",
  ],
  results: [
    { value: "0.621", label: "cognitive accuracy (majority baseline 0.621)" },
    { value: "0.480", label: "cognitive ROC-AUC" },
    { value: "0.757", label: "sleep-risk accuracy (majority baseline 0.757)" },
    { value: "0.482", label: "sleep-risk ROC-AUC" },
  ],
  resultNotes: [
    "Cognitive symptoms: mean accuracy 62.06% (SD 3.02 points) against a majority-class baseline of 62.06%, with balanced accuracy 0.500 and ROC-AUC 0.480.",
    "Sleep risk: mean accuracy 75.67% (SD 0.10 points) against a majority-class baseline of 75.67%, with ROC-AUC 0.482.",
    "Five of 40 fold-specific McNemar tests were significant after Holm correction, all against standalone models with lower accuracy (LightGBM, ANN); these are exploratory.",
    "Permutation importances are small relative to fold-to-fold variation (largest: stress frequency, 0.009 ROC-AUC).",
  ],
  outcome: [
    "The leakage-controlled stack is benchmarked transparently against a majority-class baseline on both tasks, giving the dataset a clear reference point.",
    "The evaluation pipeline (leakage control, nested cross-validation, baseline comparison) and the Streamlit prototype are reusable for further studies.",
  ],
  tools: ["Python", "scikit-learn", "CatBoost", "XGBoost", "LightGBM", "PyTorch", "Streamlit", "Pandas", "Plotly"],
  challenges: [
    "Keeping the evaluation leakage-free meant excluding all nine outcome-defining questionnaire items from the predictors and estimating the cognitive-symptom cutoff from training data only, inside every fold.",
  ],
  futureWork: [],
  baselines: [
    { model: "Four-model stack", accuracy: "62.1%" },
    { model: "Majority-class baseline", accuracy: "62.1%" },
    { model: "CatBoost standalone", accuracy: "62.1%" },
    { model: "XGBoost standalone", accuracy: "59.3%" },
    { model: "LightGBM standalone", accuracy: "57.1%" },
    { model: "ANN standalone", accuracy: "53.8%" },
  ],
  thesisCta: true,
  relatedSlugs: ["twitter-sentiment", "early-warning-customer-churn", "banglabert"],
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
      "Course research on the Sentiment140 corpus. 1.6M tweets are balanced down to 200k (100k positive + 100k negative), run through a deep preprocessing chain: lowercasing, URL/@/# removal, punctuation stripping, stopword removal, WordNet synonym substitution, Porter stemming and lemmatization, then vectorized with TF-IDF and classified by Multinomial Naïve Bayes on a stratified 80/20 split.",
    metrics: [
      { value: "74.84%", label: "accuracy" },
      { value: "200,000", label: "balanced tweets" },
      { value: "10,000", label: "TF-IDF features" },
      { value: "40,000", label: "test tweets" },
    ],
    overview: [
      "Sentiment classification on short, noisy social-media text is a classic NLP task: casual language, hashtags, mentions and slang make it harder than formal text.",
      "This study builds an end-to-end classical pipeline: an aggressive text-cleaning stage, a rich TF-IDF representation with unigrams and bigrams and a fast, interpretable Multinomial Naïve Bayes classifier.",
    ],
    problem: [
      "Raw tweets are filled with URLs, mentions, hashtags, punctuation and case differences that add noise rather than signal.",
      "Class imbalance and neutral labels can bias a sentiment model toward the majority class.",
      "Classical (non-transformer) pipelines need disciplined normalization to stay competitive.",
    ],
    objective: [
      "Build a balanced binary sentiment classifier from the Sentiment140 corpus.",
      "Design a preprocessing chain that reduces Twitter noise while preserving sentiment-bearing words.",
      "Evaluate TF-IDF + Multinomial Naïve Bayes with a stratified split and a full classification report.",
    ],
    methodology: [
      "Balanced sampling: 100,000 positive and 100,000 negative tweets drawn with random_state=42 from the 1.6M-row Sentiment140 corpus, with the neutral class excluded.",
      "Preprocessing chain: lowercase → strip URLs, @mentions, #hashtags and non-alphabetic characters → remove punctuation → tokenize → remove English stopwords → WordNet synonym substitution → Porter stemming → WordNet lemmatization (noun / verb / adjective).",
      "Vectorization: TF-IDF with max_features=10,000 and ngram_range=(1,2).",
      "Classification: Multinomial Naïve Bayes (alpha=1.0, fit_prior=True) on a stratified 80/20 split (160k train / 40k test).",
    ],
    models: [
      {
        name: "Multinomial Naïve Bayes",
        role: "Probabilistic classifier over TF-IDF counts; fast, lightweight and interpretable for text.",
      },
      {
        name: "TF-IDF (unigrams + bigrams)",
        role: "Term frequency–inverse document frequency vectorization capped at 10,000 features.",
      },
    ],
    dataset: [
      "Sentiment140 (Kaggle / kazanova): 1.6 million tweets labeled positive (4) and negative (0); neutral (2) excluded.",
      "Balanced to 200,000 rows (100k per class) with a 50/50 class distribution confirmed by a pie-chart check before training.",
    ],
    implementation: [
      "Pipeline in Python with pandas, NLTK (stopwords, punkt, wordnet) and scikit-learn (TfidfVectorizer, MultinomialNB, train_test_split, metrics).",
      "Per-class sentiment distribution visualized, null values dropped and the balanced 200k rows saved to a CSV.",
      "Evaluation outputs a confusion-matrix heatmap, a classification report and accuracy.",
      "Sanity-checked on unseen sentences: 'good' classifies positive and 'I hate this' classifies negative.",
    ],
    keyFeatures: [
      "Balanced two-class dataset with reproducible sampling (random_state=42).",
      "Deep normalization: synonym substitution + Porter stemming + multi-POS lemmatization.",
      "TF-IDF with unigrams and bigrams capped at 10,000 features.",
      "Stratified evaluation with per-class precision, recall and F1 reporting.",
    ],
    results: [
      { value: "74.84%", label: "accuracy" },
      { value: "75.05%", label: "F1 (negative)" },
      { value: "74.64%", label: "F1 (positive)" },
    ],
    resultNotes: [
      "The model reaches 74.84% accuracy on a balanced 40k-tweet held-out set, with near-symmetric precision and recall across both classes.",
      "Bigrams and synonym substitution help the model handle conversational phrasing, while aggressive cleaning keeps the feature space tractable.",
    ],
    outcome: [
      "A compact, transparent sentiment classifier that is cheap to train and easy to inspect, a strong baseline for more expensive transformer approaches.",
      "Demonstrated that disciplined preprocessing materially improves classical NLP performance on noisy social text.",
    ],
    tools: ["Python", "pandas", "NLTK", "scikit-learn", "matplotlib", "seaborn"],
    challenges: [
      "Twitter slang, URLs, mentions and hashtags are handled by a multi-stage cleaning chain: normalization, stopword removal, synonym substitution, stemming and lemmatization.",
      "Noisy distant-supervision labels are handled with balanced sampling and a stratified train/test split.",
    ],
    futureWork: [],
    relatedSlugs: ["neuronscreen", "banglabert"],
  },
  {
    slug: "early-warning-customer-churn",
    title: "Early Warning Model for High-Value Customer Drop-Off",
    shortTitle: "Early Warning Customer Churn (Data Science)",
    field: "Data Science · Customer Analytics",
    tags: ["Machine Learning", "Predictive Analytics", "Business Intelligence"],
    oneLiner:
      "RFM profiling plus clustering (KMeans++, BisectingKMeans, GMM) on the Online Retail dataset isolates 776 high-value customers and a Random Forest flags drop-off risk with 0.788 ROC-AUC.",
    summary:
      "Course research in Data Science. Cleans 541,909 transactions into a 4,338-customer RFM matrix, segments customers with unsupervised clustering compared across three algorithms, then builds a supervised early-warning classifier on month-over-month RFM decay to flag high-value customers at risk of churn.",
    metrics: [
      { value: "4,338", label: "customers" },
      { value: "776", label: "high-value segment" },
      { value: "1,917", label: "early-warning signals" },
      { value: "0.788", label: "ROC-AUC" },
    ],
    overview: [
      "Losing high-value customers is disproportionately costly. Retaining them depends on spotting the decay before they leave.",
      "This project converts raw transactional data into an RFM (Recency, Frequency, Monetary) view, segments customers into value tiers via clustering and trains a supervised classifier that raises an early-warning flag when a high-value customer's engagement starts dropping.",
    ],
    problem: [
      "Churn is only obvious after it happens. Reactive retention campaigns arrive too late.",
      "High-value customers are a minority, so generic churn models either over-alert or ignore the segment that matters most.",
      "Raw transaction logs are too granular for modeling and must be aggregated into customer-level behaviour first.",
    ],
    objective: [
      "Build a clean RFM dataset from the Online Retail corpus (541,909 transactions).",
      "Segment customers with clustering and compare KMeans++, BisectingKMeans and Gaussian Mixture Models.",
      "Define and engineer an early-risk label from month-over-month RFM decay for high-value customers.",
      "Train a classifier that predicts drop-off risk early enough to act.",
    ],
    methodology: [
      "Data cleaning: cancelled invoices, invalid transactions and rows without a customer ID are removed, reducing 541,909 rows to 397,884.",
      "RFM engineering: Recency, Frequency and Monetary computed per customer, then log-scaled with log1p to tame heavy tails.",
      "Clustering comparison: KMeans++, BisectingKMeans and GMM over k=2..7 scored with Silhouette and Davies-Bouldin; k=3 is fixed for stable, interpretable High / Mid / Low segments.",
      "Early-risk engineering: RFM rolled up per customer-month, month-over-month drop signals counted (1,917 total) and a high-value customer is labeled at risk when signals accumulate.",
      "Classification: a Random Forest (300 trees, max_depth=8, class_weight=balanced) trained on the 776 high-value customers with log-scaled RFM features and the early-risk label.",
    ],
    models: [
      {
        name: "KMeans++ / BisectingKMeans / GMM",
        role: "Clustering candidates over k=2..7, scored by Silhouette and Davies-Bouldin; k=3 chosen for stability.",
      },
      {
        name: "Random Forest",
        role: "Supervised early-risk classifier (n_estimators=300, max_depth=8, class_weight=balanced) over log-scaled RFM features.",
      },
    ],
    dataset: [
      "Online Retail dataset (UCI): 541,909 transactions across 4,338 customers from 2010-12-01 to 2011-12-09.",
      "Cleaned to 397,884 rows and aggregated into a per-customer RFM matrix, then into a customer-month panel for signal counting.",
    ],
    implementation: [
      "Data cleaning, RFM aggregation and monthly rollups in Python with pandas and NumPy.",
      "Clustering evaluated on Silhouette + Davies-Bouldin across models and k values; KMeans++ with k=3 retained.",
      "Early-risk labels built from 1,917 month-over-month decay signals across the customer-month panel.",
      "Random Forest evaluated on a stratified 25% holdout with a confusion matrix, classification report, ROC curve and feature-importance bar chart.",
    ],
    keyFeatures: [
      "log1p-scaled RFM features for robust distance-based clustering.",
      "Three-algorithm clustering comparison with two internal-validity metrics.",
      "Interpretable value segments: High 17.89% / Mid 39.10% / Low 43.02% of customers.",
      "Early-warning signal counting across customer-months that turns raw decay into a supervised label.",
    ],
    results: [
      { value: "72%", label: "classifier accuracy" },
      { value: "0.788", label: "ROC-AUC" },
      { value: "0.79", label: "recall (risk)" },
      { value: "0.51", label: "frequency importance" },
    ],
    resultNotes: [
      "The high-value segment averages 17 days since the last order, 13.3 orders and ~7,866 in monetary value versus 168 days and 1.3 orders for low-value customers.",
      "70.9% of high-value customers carry a positive early-risk label, underlining how quickly engagement decays without intervention.",
      "Frequency decay is by far the strongest risk signal (importance 0.51), ahead of monetary (0.28) and recency (0.20); the raw cluster label adds nothing on top.",
    ],
    outcome: [
      "A repeatable early-warning workflow that can run on any transaction history to prioritize retention outreach.",
      "Segmentation alone yields an immediate, interpretable view of where customer value concentrates.",
    ],
    tools: ["Python", "pandas", "NumPy", "scikit-learn", "seaborn", "matplotlib"],
    challenges: [
      "Noisy retail data (cancelled invoices, missing customer IDs, returns) was cleaned from 541,909 rows down to 397,884 usable transactions.",
      "Heavily skewed RFM values were tamed with log1p scaling before clustering.",
      "Derived, imbalanced early-risk labels were handled with a class-weighted Random Forest.",
    ],
    futureWork: [],
    relatedSlugs: ["neuronscreen", "twitter-sentiment"],
  },
  {
    slug: "water-turbidity",
    title:
      "Improving Generalization of Image-Based Water Turbidity Classification Using Fine-Tuning with Small Real-World Datasets",
    shortTitle: "Water Turbidity (CVPR paper)",
    field: "Computer Vision & Pattern Recognition",
    tags: ["Computer Vision", "Deep Learning", "Transfer Learning"],
    oneLiner:
      "EfficientNet-B0 with partial fine-tuning on 300+ self-collected phone photos classifies water turbidity (Low / Medium / High) from uncontrolled real-world images.",
    summary:
      "Course paper that tackles image-based turbidity classification with a small custom dataset of 300+ photos taken on three different smartphones in natural, uncontrolled lighting. An ImageNet-pretrained EfficientNet-B0 with partial fine-tuning learns to separate Low / Medium / High turbidity directly from field photos.",
    metrics: [
      { value: "300+", label: "real-world images" },
      { value: "3", label: "turbidity classes" },
      { value: "EfficientNet-B0", label: "backbone" },
      { value: "224×224", label: "input size" },
    ],
    overview: [
      "Turbidity (how cloudy water is) is a key water-quality signal, but conventional nephelometer measurement is expensive, slow and lab-bound.",
      "This paper proposes a lightweight deep-learning alternative: classify turbidity directly from smartphone photos taken in the field. It collects a real-world dataset, fine-tunes an EfficientNet-B0 backbone and evaluates it on field photos.",
    ],
    problem: [
      "Lab-collected turbidity datasets do not reflect real field conditions: reflections, shadows, container edges and colour distortion.",
      "Collecting enough labeled real-world images for deep learning is hard, so the dataset is small and class-imbalanced.",
      "Prior image-based work evaluated only under controlled imaging environments.",
    ],
    objective: [
      "Assemble a real-world turbidity dataset captured with consumer smartphones in uncontrolled lighting.",
      "Fine-tune EfficientNet-B0 (transfer learning with partial unfreezing) for Low / Medium / High turbidity classification.",
      "Analyze generalization on real-world images across devices and lighting conditions.",
    ],
    methodology: [
      "Dataset collection: 300+ photos taken with three smartphones (two iPhones, one Android) in natural light, manually sorted into Low, Medium and High turbidity and resized to 224×224.",
      "Architecture: EfficientNet-B0 backbone pretrained on ImageNet with a custom head (global average pooling + fully connected layer + 3-class softmax); higher-level layers unfrozen for fine-tuning.",
      "Training: Adam optimizer, categorical cross-entropy loss, class weights to counter imbalance and a reduced learning rate during fine-tuning.",
    ],
    models: [
      {
        name: "EfficientNet-B0",
        role: "ImageNet-pretrained backbone with a custom GAP + FC + softmax head; higher layers partially unfrozen.",
      },
      {
        name: "Transfer learning",
        role: "Pretrained weights plus partial fine-tuning to cope with the small real-world dataset.",
      },
    ],
    dataset: [
      "Custom dataset of 300+ photos taken with three different smartphones (two iPhones, one Android) in uncontrolled outdoor lighting.",
      "Three classes (Low, Medium and High turbidity) resized to 224×224.",
    ],
    implementation: [
      "Images standardized to 224×224 and split by class; class-weighted training to mitigate imbalance.",
      "Partial fine-tuning of the backbone's higher layers with a low learning rate.",
      "Evaluated with a confusion matrix, per-class precision / recall / F1 and train-versus-validation learning curves.",
    ],
    keyFeatures: [
      "Real-world capture protocol across multiple devices and natural-light conditions.",
      "Transfer learning with partial fine-tuning to survive a small dataset.",
      "Class weighting to counter imbalance.",
      "Per-class evaluation with a confusion matrix and train-versus-validation learning curves.",
    ],
    results: [
      { value: "300+", label: "real-world images" },
      { value: "3", label: "smartphones" },
      { value: "3", label: "turbidity classes" },
    ],
    resultNotes: [
      "The model reliably recognizes visually cloudy water from phone photos taken in natural light.",
      "Evaluation covers a confusion matrix, per-class precision / recall / F1 and train-versus-validation learning curves.",
    ],
    outcome: [
      "A low-cost, portable approach to assessing water turbidity from smartphone photos, backed by a real-world, multi-device dataset.",
    ],
    tools: ["Python", "PyTorch", "EfficientNet", "NumPy", "matplotlib"],
    challenges: [
      "Small, imbalanced field dataset: addressed with ImageNet transfer learning, partial fine-tuning and class weighting.",
      "Variable lighting, reflections and container edges: addressed by capturing across three smartphones in natural light and standardizing images to 224×224.",
    ],
    futureWork: [],
    relatedSlugs: ["neuronscreen", "twitter-sentiment"],
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
    overview: [
      "Toxic and hateful comments are rampant on Bengali social media and the mental-health toll on adolescents is real. Most existing detection systems optimize accuracy alone and offer no explanation for their verdicts.",
      "This study fine-tunes BanglaBERT for toxic-comment classification and wraps it in an explainability mechanism (LIME and SHAP) so moderators can see exactly which tokens triggered a flag.",
    ],
    problem: [
      "Bengali toxicity detection is underserved: the language is low-resource and informal writing, acronyms and context-dependent insults defeat keyword rules and classical ML.",
      "Transformer models detect toxicity well but act as black boxes, which undermines trust in automated moderation.",
      "Applying both SHAP and LIME to a transformer-based Bangla toxicity framework had rarely been explored.",
    ],
    objective: [
      "Fine-tune BanglaBERT for binary toxic / non-toxic Bengali comment classification.",
      "Evaluate with 5-fold stratified cross-validation for reliable estimates.",
      "Add SHAP and LIME to surface the words driving each prediction.",
      "Contribute a transparent, trustworthy framework to low-resource Bangla NLP.",
    ],
    methodology: [
      "Data: multiple Bengali toxicity corpora compiled into a labeled benchmark for fine-tuning and evaluation.",
      "Model: BanglaBERT, the Bengali member of the BERT family, fine-tuned for sequence classification.",
      "Training: 5-fold stratified cross-validation with averaged accuracy, F1 and ROC-AUC reported.",
      "Explainability: LIME and SHAP both applied to individual predictions to identify important toxic words and validate model behaviour.",
    ],
    models: [
      {
        name: "BanglaBERT",
        role: "Fine-tuned transformer with a sequence-classification head for toxic / non-toxic prediction.",
      },
      {
        name: "SHAP + LIME",
        role: "Post-hoc local explainers that attribute each prediction to the words that drove it.",
      },
    ],
    dataset: [
      "Multiple Bengali toxicity datasets combined: a BanglaMedia corpus, a Bengali comments dataset, a contextual toxicity dataset, plus auxiliary and synthetic augmentation sets.",
    ],
    implementation: [
      "Fine-tuning loop over five stratified folds with the BanglaBERT transformer, aggregating per-fold metrics.",
      "Post-hoc analysis on held-out toxic and non-toxic examples using SHAP (additive attribution) and LIME (local surrogate) to highlight decisive tokens.",
    ],
    keyFeatures: [
      "5-fold stratified cross-validation for reliable generalization estimates.",
      "Dual explainability: both SHAP and LIME on the same framework.",
      "Word-level attribution that names the toxic terms behind each flag.",
      "Focus on low-resource Bangla NLP rather than high-resource English.",
    ],
    results: [
      { value: "86%", label: "accuracy" },
      { value: "87%", label: "F1-score" },
      { value: "0.91", label: "ROC-AUC" },
    ],
    resultNotes: [
      "Averaged over the five folds, the fine-tuned BanglaBERT reaches 86% accuracy, 87% F1-score and 0.91 ROC-AUC.",
      "SHAP and LIME attributions align with toxic keywords, showing the model reasons over the expected linguistic signals rather than spurious cues.",
    ],
    outcome: [
      "A validated, explainable toxicity detector that can underpin intelligent online moderation for Bengali content.",
      "A reproducible template for pairing transformer classifiers with SHAP + LIME in low-resource languages.",
    ],
    tools: ["Python", "Hugging Face Transformers", "BanglaBERT", "SHAP", "LIME", "PyTorch", "scikit-learn"],
    challenges: [
      "Bengali linguistic nuance (context-dependent insults, slang, transliterated forms) is handled by fine-tuning BanglaBERT, a Bengali-native transformer.",
      "Limited labeled Bengali toxicity data was addressed by compiling multiple corpora and adding augmentation.",
    ],
    futureWork: [],
    relatedSlugs: ["twitter-sentiment", "neuronscreen"],
  },
];

export function getResearch(slug: string) {
  return researchPapers.find((p) => p.slug === slug);
}
