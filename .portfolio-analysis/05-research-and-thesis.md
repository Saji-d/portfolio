# 05: Research & Thesis

## Primary Thesis: NeuroScreen
**Full title:** "Neuro-Screen: A Hybrid Machine Learning and Deep Learning Ensemble Framework for Detection of Cognitive Impairment in Insomniac University Students"

- **Course:** CSC 4298 Thesis/Project, Fall 2025-26
- **Field:** ML, Deep Learning, Healthcare Informatics
- **Dataset:** 2,237 survey responses from university students in Bangladesh (ages 20–35)
- **Methodology:**
  - Feature engineering & scaling across 7 cumulative cognitive symptom categories
  - Dual-path training: CatBoost (GBDT) + 3-layer ANN (128-64-1 MLP, ReLU, Adam, dropout 0.3)
  - Arithmetic mean probability blending
  - 80/20 stratified train/test split
  - Target engineering: sum of 7 cognitive symptoms → binary healthy/impaired
- **Results:** Accuracy 95.20% · Precision 94.40% · Recall 96.10% · F1 95.24% · ROC-AUC 0.9820
  - Beats standalone CatBoost (94.12%) and ANN (91.25%)
- **Feature importance:** Mental/Physical Fatigue, Stress Frequency, GPA Impact (0.095 importance) as primary predictors of cognitive impairment
- **Supporting artifacts:** Full thesis report (docx/pdf), Chapter 1&2 final (docx/pdf), Introduction & Related Work with REFERENCES.docx, THESIS_Literature_Review.xlsx, Final-Neuro-Screen_Presentation-2.pptx, per-member review folders (Sajid, Iqramul, Khadija, Shahadat - 4 papers + 4 review docx each), 16 numbered reference papers, "Thesis Report Writing by SAJID" drafting pipeline (PROJECT_UNDERSTANDING.md, THESIS_REQUIREMENTS.md, WRITING_RULES.md, WRITING_STYLE_GUIDE.md, REFERENCE_MATRIX.md, CITATION_MAP.md, CONSISTENCY_CHECK.md).

## Published-adjacent Course Papers
1. **CVPR (Group 10):** "Improving Generalization of Image-Based Water Turbidity Classification Using Fine-Tuning with Small Real-World Datasets" - EfficientNet-B0 + transfer learning; custom water turbidity dataset (High/Low/Medium, ~300 phone photos) + cat/dog/panda dataset. Code: CVPR_Model.ipynb.
2. **Data Mining (DWDM):** "Explainable Bangla Toxic Comment Detection using BanglaBERT with SHAP and LIME" (IEEE format, with Fatima Hridi & Asif Akber) - k-fold (5) and 70/15/15 splits; multiple toxicity datasets (Bengali comments, synthetic, contextual).
3. **HCI:** "Adaptive InteractOut: A Context-Aware, Personalized Intervention for Smartphone Overuse" (group paper + poster).
4. **Research Methodology (Group 7):** "Entrepreneurship Over Employment: Guiding Bangladeshi Youth Towards Innovation and Self-Reliance."

## Independent / Course Projects (Research-flavored)
- **FinBERT Financial Sentiment Analysis** - fine-tuned FinBERT vs BERT on financial text; Hugging Face, PyTorch, NLTK.
- **Twitter Sentiment Analysis** - NLTK, TF-IDF, Scikit-learn.
- **RFM Early-Warning Model for High-Value Customer** - UK online retail dataset; RFM segmentation + K-Means + ML churn prediction.
- **CVPR notebook suite** - EfficientNet face recognition, KNN classification, LBPH face recognition, MLP pattern recognition, NN MNIST.

## Research Depth Assessment
- **Strengths:** Real datasets (self-collected survey for thesis, self-collected photos for turbidity); rigorous methodology; explainability work (SHAP/LIME) is differentiating; systematic literature-review process.
- **Gaps:** No published peer-reviewed venue identified (all course/thesis-level). No citation metrics available. Dataset sizes are modest (2,237 / ~300).
- **Recommendation:** Position as "undergraduate research track" - the process discipline (citation maps, consistency checks) is itself a selling point.
