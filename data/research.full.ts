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
    "Neuro-Screen: A Hybrid Ensemble Framework for Detection of Cognitive Impairment in Insomniac University Students",
  shortTitle: "NeuroScreen (Thesis)",
  field: "Undergraduate Thesis · Healthcare ML / DL",
  featured: true,
  tags: ["Machine Learning", "Deep Learning", "Healthcare AI", "CatBoost", "ANN"],
  github: "https://github.com/Saji-d/neuro-screen",
  live: "https://neuro-screen.streamlit.app/",
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
  overview: [
    "Cognitive impairment linked to insomnia is widespread among university students but rarely screened for. Existing computational work stops at diagnosing sleep disorders or general mental-health distress. It does not classify the cognitive decline that poor sleep produces.",
    "Neuro-Screen fills that gap with a hybrid ensemble: a CatBoost gradient-boosting classifier, which is strong on categorical, structured survey data, combined with a three-layer ANN, which is strong on non-linear feature interactions. The two paths run in parallel and their probability outputs are averaged into a final Healthy / Impaired decision.",
    "Evaluated on a stratified 80/20 holdout, the ensemble reaches 95.20% accuracy and a 0.982 ROC-AUC, higher than either component alone, and is packaged as a Streamlit screening dashboard with a conversational check-in.",
  ],
  problem: [
    "Most university students get insufficient sleep and a substantial share meet clinical insomnia criteria. Both conditions measurably impair attention, memory, and academic performance.",
    "Existing ML studies target sleep disorders themselves (insomnia, apnea) or general mental health, not the cognitive decline insomnia causes, and they rely on standalone classifiers rather than hybrid ML-DL designs.",
    "As a result, no automated framework exists for early detection of cognitive impairment among insomniac university students.",
  ],
  objective: [
    "Develop a hybrid CatBoost + ANN ensemble that fuses both models' probability outputs into a binary cognitive-health classification.",
    "Benchmark the ensemble against standalone CatBoost and ANN across accuracy, precision, recall, F1-score, and ROC-AUC.",
    "Identify which behavioral, psychological, and sleep-related features most strongly predict cognitive impairment.",
    "Provide a practical, data-driven screening approach that helps universities flag at-risk students early.",
  ],
  methodology: [
    "Survey design and collection: 2,237 responses from Bangladeshi university students aged 20–35, capturing demographics, lifestyle and behavioural habits, mental stamina, insomnia indicators, and cognitive-symptom indicators.",
    "Preprocessing and target engineering: cleaned and scaled the 14 lifestyle input features, then aggregated multiple cognitive-symptom indicators into a single binary Healthy / Impaired target.",
    "Dual-path training: CatBoost on the categorical tabular side and a three-layer ANN (128-64-1 MLP) on the numerical side, trained in parallel.",
    "Ensemble blending: the final decision is the arithmetic mean of both models' predicted probabilities.",
    "Evaluation: an 80/20 stratified split (1,790 train / 447 test) scored with accuracy, precision, recall, F1-score, and ROC-AUC, plus confusion-matrix and learning-curve analysis.",
  ],
  models: [
    {
      name: "CatBoost",
      role: "Gradient-boosted decision trees with native categorical-feature handling; captures non-linear interactions between survey answers.",
    },
    {
      name: "ANN (128-64-1 MLP)",
      role: "Three-layer feed-forward network for deep feature extraction over the vectorized numeric features.",
    },
    {
      name: "Hybrid ensemble",
      role: "Arithmetic-mean blending of both models' probabilities, combining complementary strengths and beating either alone.",
    },
  ],
  dataset: [
    "2,237 survey responses from Bangladeshi university students aged 20–35.",
    "14 lifestyle input features spanning demographics, caffeine intake, bedtime device use, cognitive load, stress frequency, mental stamina, spacing-out / audio-lag episodes, sleep hours, night awakenings, sleep quality, forgetfulness, reminder reliance, brain fog, missed deadlines, GPA impact, and fatigue.",
    "A binary target engineered by aggregating multiple cognitive-symptom indicators into Healthy / Impaired.",
  ],
  implementation: [
    "Built in Python on Google Colab with pandas (data manipulation), CatBoost (gradient boosting), and PyTorch (ANN).",
    "Both modules trained in parallel, then combined with probability-level ensemble blending for the final binary prediction.",
    "Validated with a confusion matrix and ROC-AUC analysis: the held-out matrix shows 212 true negatives, 192 true positives, 43 false negatives, and 63 false positives across 447 test cases.",
    "Deployed as a Streamlit screening prototype: a slider-based Quick Check-in and a conversational check-in assistant that both return a 0–100 risk score with model confidence and the driving factors.",
  ],
  keyFeatures: [
    "Parallel CatBoost + ANN architecture with an averaged ensemble decision.",
    "Target engineering that turns multiple cognitive-symptom signals into one robust binary label.",
    "Stratified evaluation with confusion matrix, ROC-AUC, and per-model comparison.",
    "Feature-importance analysis surfacing the strongest predictors of impairment.",
    "Streamlit prototype with both a form-based and a conversational screening interface.",
  ],
  results: [
    { value: "95.20%", label: "accuracy" },
    { value: "94.40%", label: "precision" },
    { value: "96.10%", label: "recall" },
    { value: "95.24%", label: "F1-score" },
    { value: "0.982", label: "ROC-AUC" },
  ],
  resultNotes: [
    "The hybrid beats both standalones on every metric: CatBoost reaches 94.12% accuracy and the ANN 91.25%, while the ensemble reaches 95.20%.",
    "Hybrid ROC-AUC of 0.9820 vs. CatBoost 0.9780 and ANN 0.9450. The sharp early trajectory shows high sensitivity with a low false-positive rate across thresholds, which suits screening use cases.",
    "The insomnia–cognition link is confirmed in the data: roughly 55% of the insomniac group is classified Impaired versus 25% of the non-insomnia group.",
  ],
  outcome: [
    "A validated, cost-effective screening framework for university health surveillance that flags at-risk students for academic and psychological intervention.",
    "Identified mental/physical fatigue, stress frequency, and GPA impact as the strongest predictors (0.095), with sleep quality (0.093) outweighing sleep duration (0.092).",
    "Positioned as a screening aid rather than a medical diagnostic, following privacy-by-design and responsible-AI principles on anonymized data.",
  ],
  tools: ["Python", "Google Colab", "Pandas", "CatBoost", "PyTorch", "Streamlit", "scikit-learn"],
  challenges: [
    "Self-reported survey data carry response and recall bias.",
    "A single-institution cohort limits broader generalizability.",
    "Binary classification only: no severity levels for cognitive impairment.",
    "Hyperparameter tuning was constrained by local CPU/RAM availability.",
  ],
  futureWork: [
    "Multi-institutional and longitudinal data collection to study temporal changes in cognitive health.",
    "Integrate Explainable AI (SHAP/LIME) for clinical interpretability.",
    "Add objective physiological biomarkers such as actigraphy or EEG signals.",
    "Deploy the framework within real campus health-surveillance systems.",
  ],
  baselines: [
    { model: "NeuroScreen ensemble", accuracy: "95.20%" },
    { model: "CatBoost standalone", accuracy: "94.12%" },
    { model: "ANN standalone", accuracy: "91.25%" },
  ],
  featureImportance: [
    { name: "Mental / Physical Fatigue", importance: "0.095" },
    { name: "Stress Frequency", importance: "0.095" },
    { name: "GPA Impact (Sleep)", importance: "0.095" },
    { name: "Overall Sleep Quality", importance: "0.093" },
    { name: "Average Sleep Hours", importance: "0.092" },
    { name: "Bedtime Device Use", importance: "0.082" },
    { name: "Reminder Reliance", importance: "0.066" },
    { name: "Caffeine Intake", importance: "0.063" },
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
      "Course research on the Sentiment140 corpus. 1.6M tweets are balanced down to 200k (100k positive + 100k negative), run through a deep preprocessing chain: lowercasing, URL/@/# removal, punctuation stripping, stopword removal, WordNet synonym substitution, Porter stemming, and lemmatization, then vectorized with TF-IDF and classified by Multinomial Naïve Bayes on a stratified 80/20 split.",
    metrics: [
      { value: "74.84%", label: "accuracy" },
      { value: "200,000", label: "balanced tweets" },
      { value: "10,000", label: "TF-IDF features" },
      { value: "40,000", label: "test tweets" },
    ],
    overview: [
      "Sentiment classification on short, noisy social-media text is a classic NLP task: casual language, hashtags, mentions, and slang make it harder than formal text.",
      "This study builds an end-to-end classical pipeline: an aggressive text-cleaning stage, a rich TF-IDF representation with unigrams and bigrams, and a fast, interpretable Multinomial Naïve Bayes classifier.",
    ],
    problem: [
      "Raw tweets are filled with URLs, mentions, hashtags, punctuation, and case differences that add noise rather than signal.",
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
      "Preprocessing chain: lowercase → strip URLs, @mentions, #hashtags, and non-alphabetic characters → remove punctuation → tokenize → remove English stopwords → WordNet synonym substitution → Porter stemming → WordNet lemmatization (noun / verb / adjective).",
      "Vectorization: TF-IDF with max_features=10,000 and ngram_range=(1,2).",
      "Classification: Multinomial Naïve Bayes (alpha=1.0, fit_prior=True) on a stratified 80/20 split (160k train / 40k test).",
    ],
    models: [
      {
        name: "Multinomial Naïve Bayes",
        role: "Probabilistic classifier over TF-IDF counts; fast, lightweight, and interpretable for text.",
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
      "Pipeline in Python with pandas, NLTK (stopwords, punkt, wordnet), and scikit-learn (TfidfVectorizer, MultinomialNB, train_test_split, metrics).",
      "Per-class sentiment distribution visualized, null values dropped, and the balanced 200k rows saved to a CSV.",
      "Evaluation outputs a confusion-matrix heatmap, a classification report, and accuracy.",
      "Sanity-checked on unseen sentences: 'good' classifies positive and 'I hate this' classifies negative.",
    ],
    keyFeatures: [
      "Balanced two-class dataset with reproducible sampling (random_state=42).",
      "Deep normalization: synonym substitution + Porter stemming + multi-POS lemmatization.",
      "TF-IDF with unigrams and bigrams capped at 10,000 features.",
      "Stratified evaluation with per-class precision, recall, and F1 reporting.",
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
      "Twitter slang, abbreviations, and emojis resist rule-based cleaning.",
      "Sentiment140 is noisy by construction (distant-supervision labels), capping the achievable accuracy.",
      "Classical models cannot capture the long-range contextual meaning that transformers handle.",
    ],
    futureWork: [
      "Compare against contextual models such as BERT or BanglaBERT-style transformers using this Naïve Bayes result as the baseline.",
      "Add a neutral class and multi-class sentiment labels.",
      "Tune TF-IDF parameters (ngram range, sublinear TF, min_df) and try SVMs or logistic regression.",
    ],
    relatedSlugs: ["neuronscreen", "banglabert"],
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
    overview: [
      "Losing high-value customers is disproportionately costly. Retaining them depends on spotting the decay before they leave.",
      "This project converts raw transactional data into an RFM (Recency, Frequency, Monetary) view, segments customers into value tiers via clustering, and trains a supervised classifier that raises an early-warning flag when a high-value customer's engagement starts dropping.",
    ],
    problem: [
      "Churn is only obvious after it happens. Reactive retention campaigns arrive too late.",
      "High-value customers are a minority, so generic churn models either over-alert or ignore the segment that matters most.",
      "Raw transaction logs are too granular for modeling and must be aggregated into customer-level behaviour first.",
    ],
    objective: [
      "Build a clean RFM dataset from the Online Retail corpus (541,909 transactions).",
      "Segment customers with clustering and compare KMeans++, BisectingKMeans, and Gaussian Mixture Models.",
      "Define and engineer an early-risk label from month-over-month RFM decay for high-value customers.",
      "Train a classifier that predicts drop-off risk early enough to act.",
    ],
    methodology: [
      "Data cleaning: cancelled invoices, invalid transactions, and rows without a customer ID are removed, reducing 541,909 rows to 397,884.",
      "RFM engineering: Recency, Frequency, and Monetary computed per customer, then log-scaled with log1p to tame heavy tails.",
      "Clustering comparison: KMeans++, BisectingKMeans, and GMM over k=2..7 scored with Silhouette and Davies-Bouldin; k=3 is fixed for stable, interpretable High / Mid / Low segments.",
      "Early-risk engineering: RFM rolled up per customer-month, month-over-month drop signals counted (1,917 total), and a high-value customer is labeled at risk when signals accumulate.",
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
      "Data cleaning, RFM aggregation, and monthly rollups in Python with pandas and NumPy.",
      "Clustering evaluated on Silhouette + Davies-Bouldin across models and k values; KMeans++ with k=3 retained.",
      "Early-risk labels built from 1,917 month-over-month decay signals across the customer-month panel.",
      "Random Forest evaluated on a stratified 25% holdout with a confusion matrix, classification report, ROC curve, and feature-importance bar chart.",
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
      "The high-value segment averages 17 days since the last order, 13.3 orders, and ~7,866 in monetary value versus 168 days and 1.3 orders for low-value customers.",
      "70.9% of high-value customers carry a positive early-risk label, underlining how quickly engagement decays without intervention.",
      "Frequency decay is by far the strongest risk signal (importance 0.51), ahead of monetary (0.28) and recency (0.20); the raw cluster label adds nothing on top.",
    ],
    outcome: [
      "A repeatable early-warning workflow that can run on any transaction history to prioritize retention outreach.",
      "Segmentation alone yields an immediate, interpretable view of where customer value concentrates.",
    ],
    tools: ["Python", "pandas", "NumPy", "scikit-learn", "seaborn", "matplotlib"],
    challenges: [
      "Raw retail data is noisy: cancelled invoices, missing customer IDs, and returns require careful cleaning.",
      "RFM values are heavily skewed, so naive scaling distorts clustering.",
      "Early-risk labels are derived and imbalanced, which caps the classifier's ceiling.",
    ],
    futureWork: [
      "Add customer tenure, product-category diversity, and seasonality features.",
      "Test gradient-boosting classifiers (CatBoost / XGBoost) and time-to-event (survival) models.",
      "Validate the early-warning signals against actual churn in a longitudinal holdout.",
    ],
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
      "EfficientNet-B0 with partial fine-tuning on 300+ self-collected phone photos tries to classify turbidity from uncontrolled real-world images, an honest look at how hard field generalization is.",
    summary:
      "Course paper that tackles image-based turbidity classification with a small custom dataset of 300+ photos taken on three different smartphones in natural, uncontrolled lighting. An ImageNet-pretrained EfficientNet-B0 with partial fine-tuning learns to separate Low / Medium / High turbidity, and the paper candidly reports the limits of doing so from photos alone.",
    metrics: [
      { value: "300+", label: "real-world images" },
      { value: "3", label: "turbidity classes" },
      { value: "EfficientNet-B0", label: "backbone" },
      { value: "224×224", label: "input size" },
    ],
    overview: [
      "Turbidity (how cloudy water is) is a key water-quality signal, but conventional nephelometer measurement is expensive, slow, and lab-bound.",
      "This paper proposes a lightweight deep-learning alternative: classify turbidity directly from smartphone photos taken in the field. It collects a real-world dataset, fine-tunes an EfficientNet-B0 backbone, and reports what works and what does not.",
    ],
    problem: [
      "Lab-collected turbidity datasets do not reflect real field conditions: reflections, shadows, container edges, and colour distortion.",
      "Collecting enough labeled real-world images for deep learning is hard, so the dataset is small and class-imbalanced.",
      "Prior image-based work evaluated only under controlled imaging environments.",
    ],
    objective: [
      "Assemble a real-world turbidity dataset captured with consumer smartphones in uncontrolled lighting.",
      "Fine-tune EfficientNet-B0 (transfer learning with partial unfreezing) for Low / Medium / High turbidity classification.",
      "Analyze generalization honestly: where the model succeeds and where real-world noise defeats it.",
    ],
    methodology: [
      "Dataset collection: 300+ photos taken with three smartphones (two iPhones, one Android) in natural light, manually sorted into Low, Medium, and High turbidity, and resized to 224×224.",
      "Architecture: EfficientNet-B0 backbone pretrained on ImageNet with a custom head (global average pooling + fully connected layer + 3-class softmax); higher-level layers unfrozen for fine-tuning.",
      "Training: Adam optimizer, categorical cross-entropy loss, class weights to counter imbalance, and a reduced learning rate during fine-tuning.",
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
      "Three classes (Low, Medium, and High turbidity) resized to 224×224.",
    ],
    implementation: [
      "Images standardized to 224×224 and split by class; class-weighted training to mitigate imbalance.",
      "Partial fine-tuning of the backbone's higher layers with a low learning rate.",
      "Evaluated with a confusion matrix, per-class precision / recall / F1, and train-versus-validation learning curves.",
    ],
    keyFeatures: [
      "Real-world capture protocol across multiple devices and natural-light conditions.",
      "Transfer learning with partial fine-tuning to survive a small dataset.",
      "Class weighting to counter imbalance.",
      "Honest reporting of validation accuracy across fine-tuning phases.",
    ],
    results: [
      { value: "18–47%", label: "validation accuracy" },
      { value: "High", label: "majority prediction" },
    ],
    resultNotes: [
      "Validation accuracy fluctuated between roughly 18% and 47% across fine-tuning phases while training accuracy kept climbing, the signature of a small, noisy, imbalanced dataset.",
      "Predictions skew heavily toward the high-turbidity class, and the model struggles to separate medium from low turbidity.",
      "Qualitatively, the model reliably recognizes visually cloudy water; most errors trace to reflections, container edges, and lighting artifacts rather than to the water itself.",
    ],
    outcome: [
      "A preliminary, low-cost, portable turbidity-assessment approach that demonstrates feasibility and, just as importantly, documents the real-world failure modes.",
      "Clear evidence that image-only turbidity classification is an open problem, pointing future work toward better data and physics-aware features.",
    ],
    tools: ["Python", "PyTorch", "EfficientNet", "NumPy", "matplotlib"],
    challenges: [
      "Small, imbalanced dataset from a hard-to-control capture environment.",
      "Visual similarity between classes under variable lighting.",
      "Reflections, shadows, and container edges corrupt the signal.",
      "Validation instability when fine-tuning a deep network on limited data.",
    ],
    futureWork: [
      "Augment the dataset substantially across more devices, scenes, and lighting conditions.",
      "Move from classification to regression-based turbidity estimation.",
      "Investigate physics-informed colour correction to remove lighting and reflection effects.",
    ],
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
      "Toxic and hateful comments are rampant on Bengali social media, and the mental-health toll on adolescents is real. Most existing detection systems optimize accuracy alone and offer no explanation for their verdicts.",
      "This study fine-tunes BanglaBERT for toxic-comment classification and wraps it in an explainability mechanism (LIME and SHAP) so moderators can see exactly which tokens triggered a flag.",
    ],
    problem: [
      "Bengali toxicity detection is underserved: the language is low-resource, and informal writing, acronyms, and context-dependent insults defeat keyword rules and classical ML.",
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
      "Training: 5-fold stratified cross-validation with averaged accuracy, F1, and ROC-AUC reported.",
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
      "Averaged over the five folds, the fine-tuned BanglaBERT reaches 86% accuracy, 87% F1-score, and 0.91 ROC-AUC.",
      "SHAP and LIME attributions align with toxic keywords, showing the model reasons over the expected linguistic signals rather than spurious cues.",
    ],
    outcome: [
      "A validated, explainable toxicity detector that can underpin intelligent online moderation for Bengali content.",
      "A reproducible template for pairing transformer classifiers with SHAP + LIME in low-resource languages.",
    ],
    tools: ["Python", "Hugging Face Transformers", "BanglaBERT", "SHAP", "LIME", "PyTorch", "scikit-learn"],
    challenges: [
      "Bengali linguistic nuance: context-dependent insults, slang, and transliterated forms.",
      "Limited high-quality labeled Bengali toxicity data; augmentation was needed.",
      "Explainability tools are compute-heavy over transformer embeddings.",
    ],
    futureWork: [
      "Extend to multi-class severity (sarcasm, misogyny, religious hate) and cross-lingual transfer.",
      "Scale the labeled corpus and test other Bangla transformer variants (m-BERT, XLM-R, MuRIL).",
      "Ship the explainable scorer as a live moderation API.",
    ],
    relatedSlugs: ["twitter-sentiment", "neuronscreen"],
  },
];

export function getResearch(slug: string) {
  return researchPapers.find((p) => p.slug === slug);
}
