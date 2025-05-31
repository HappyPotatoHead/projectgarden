---
title: Cardiovascular Risk Analysis
draft: false
tags:
  - data_science
  - machine_learning
description:
---
>[!IMPORTANT] Check out the repository!
>[Click me!](https://github.com/HappyPotatoHead/Cardiovascular-Risk-Analysis)
# Problem Statement

This project aimed to analyse patient data to identify key risk factors for cardiovascular disease and develop a predictive model for assessment. Diagnosis of cardiovascular risk can be made easier and smoother, albeit the predictions still require professionals' insights. Nonetheless, machine learning can help doctors and researchers to learn and uncover unsuspected correlations and new trends, allowing them to make informed decisions.

Cardiovascular diseases are one of the most significant health challenges worldwide, contributing to millions of death each year. Early detection and accurate prediction of cardiovascular risk in an individual can save that individual from costs of treatment, pain, and stress, leading to an overall healthier and happier life. 

# Data Source

The dataset includes patient information such as age, gender, lifestyle factors, health metrics, and demographic profile.

| Gender | Age | Height(cm) | Weight(kg) | Family_history | Alcohol | Junk_food | Vege_day | Meals_day | Snack     | Smoking | Water_intake(L) | Transportation | Exercise | TV       | Income | Discipline | Cardiovascular_risk |
| ------ | --- | ---------- | ---------- | -------------- | ------- | --------- | -------- | --------- | --------- | ------- | --------------- | -------------- | -------- | -------- | ------ | ---------- | ------------------- |
| Female | 42  | 172.2      | 82.9       | no             | low     | yes       | 3        | 3         | Sometimes | no      | 2.72            | car            | 3        | rare     | 2081   | no         | medium              |
| Female | 19  | 175.3      | 80         | yes            | none    | yes       | 2        | 1         | Sometimes | no      | 2.65            | bus            | 3        | moderate | 5551   | no         | medium              |
| Female | 43  | 158.3      | 81.9       | yes            | none    | yes       | 3        | 1         | Sometimes | no      | 1.89            | car            | 1        | rare     | 14046  | no         | high                |
| Female | 23  | 165        | 70         | yes            | low     | no        | 2        | 1         | Sometimes | no      | 2               | bus            | 0        | rare     | 9451   | no         | medium              |
| Male   | 23  | 169        | 75         | yes            | low     | yes       | 3        | 3         | Sometimes | no      | 2.82            | bus            | 1        | often    | 17857  | no         | medium              |
| Male   | 23  | 172        | 82         | yes            | low     | yes       | 2        | 1         | Sometimes | no      | 1               | bus            | 1        | moderate | 3114   | no         | medium              |
| Female | 21  | 172        | 133.9      | yes            | low     | yes       | 3        | 3         | Sometimes | no      | 2.42            | bus            | 2        | moderate | 8011   | no         | high                |
| Male   | 21  | 172.5      | 82.3       | yes            | low     | yes       | 2        | 2         | Sometimes | no      | 2               | bus            | 2        | moderate | 5838   | no         | medium              |
| Female | 19  | 165        | 82         | yes            | none    | yes       | 3        | 3         | Sometimes | no      | 1               | bus            | 0        | moderate | 10029  | no         | high                |

%% 
```dataview
TABLE WITHOUT ID 
Gender, Age, Height, Weight, Family_history, Alcohol, Junk_food, Vege_day, Meals_day, Snack, Smoking, Water_intake, Transportation, Exercise, TV, Income, Discipline, Cardiovascular_risk
FROM csv("dataset.csv")
LIMIT 10
``` 
%%

# Exploratory Data Analysis

>[!WARNING]
>I don't have much information over the dataset other than the data, so most of the analysis are speculations.

The dataset has 17 features, 1 label and 2100 rows:
```python 
row, column = cardio_df.shape
print(f"The number of rows: {row}\nThe number of columns: {column}\n")

cardio_df.info()
```

```
RangeIndex: 2100 entries, 0 to 2099
Data columns (total 18 columns):
 #   Column                  Non-Null Count  Dtype  
---  ------                  --------------  -----  
 0   Gender                  2100 non-null   object 
 1   Age                     2100 non-null   int64  
 2   Height(cm)              2100 non-null   float64
 3   Weight(kg)              2100 non-null   float64
 4   Family_history          2100 non-null   object 
 5   Alcohol                 2100 non-null   object 
 6   Junk_food               2100 non-null   object 
 7   Vege_day                2100 non-null   int64  
 8   Meals_day               2100 non-null   int64  
 9   Snack                   2100 non-null   object 
 10  Smoking                 2100 non-null   object 
 11  Water_intake(L)         2100 non-null   float64
 12  Transportation          2100 non-null   object 
 13  Exercise                2100 non-null   int64  
 14  TV                      2100 non-null   object 
 15  Income                  2100 non-null   int64  
 16  Discipline              2100 non-null   object 
 17  Cardiovascular_risk(y)  2100 non-null   object 
dtypes: float64(3), int64(5), object(10)
memory usage: 295.4+ KB
```

Information from the output above:
1. There are 17 features
2. There is no `null` values

Before moving on to analysing and visualizing the dataset, it is important to extract relevant features first.
Those are:
1. gender
2. age
3. height(cm)
4. weight(kg)
5. family_history
6. alcohol
7. junk_food
8. snack
9. smoking 
10. transportation
11. exercise
12. tv
13. discipline

Height and weight will be combined to become BMI as, individually, doesn’t give much information.

These features have a more direct relationships with 
cardiovascular risks compared to vege_day, meals_day, water_intake(L), and income. The meaning of the values in vege_day is ambiguous and do not synchronise with the values in meals_day. The volume of water intake does influence the risk of cardiovascular disease but, its relationship with cardiovascular risk is often indirect and influenced by other factors.

Income is also ignored as we have features such as junk food, smoking, exercise, and TV that can serve as proxies for socio-economic status. 

## Univariate Analysis

### Cardiovascular Risk 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/cardiovascular_risk.jpg]]

Most individuals in the dataset — 967 — are at high risk of developing cardiovascular diseases. The distribution of individuals with low and medium cardiovascular risk is relatively even, with minor differences.

This could indicate that the population is, overall, rather unhealthy. However, the sample size of 2,100 may be too small to represent the general population. 

This could also suggest that the sample was collected from a region where sedentary or unhealthy lifestyles are more prevalent.

### Age, Weight, and Height

![[content/Data Analysis & Machine Learning/images/Cardiovascular/age_bmi_histogram.jpg]]

The age distribution is right-skewed, indicating that the demographic of the dataset is primarily teenagers and working adults. Based on the [[Cardiovascular Risk Analysis#Cardiovascular Risk|cardiovascular risk graph]], this suggests that most individuals with a higher risk of cardiovascular disease are younger.

The histogram shows that the distribution of height is a rather normal distribution with some spikes. The distribution of weight is slightly right skewed with some seemingly extreme weights. Paired with the age histogram, this may explain why individuals with a higher risk of developing cardiovascular risk are younger. 

Finally, the BMI histogram denotes a multimodal distribution, as shown by the presence of multiple 
peaks. There are peaks between 15 and 20, between 25 and 30, and between 30 and 40. This suggests that the dataset may represent several underlying subpopulations or distinct clusters with different BMI ranges.

### Lifestyle and Demographic

![[content/Data Analysis & Machine Learning/images/Cardiovascular/lifestyle_demographic.jpg]]

The data distribution for the gender feature is evenly distributed with 50.5% male and 49.5% female. This suggests that both genders are evenly represented in the dataset. This can minimise potential bias in the machine learning model, preventing the model from skewing 
towards one gender over the other. 

The majority of individuals — 81.7% — have a family member with cardiovascular disease, while only 18.3% have no such family history. Having a family history _of_ cardiovascular disease is shown to elevate the risk factor.[^1][^2]

The alcohol feature shows that the low value significantly dominates the rest, followed by none. This suggests that the younger individuals in the sample tend to consume little to no alcohol. Alcohol is also known to elevate the risk factor, and the relatively low levels of alcohol consumption suggest that other factors are likely driving the risk factor.

It may be argued that low to moderate alcohol consumption is cardio-protective amongst apparently healthy individuals [^3]; however, this conclusion is made from some older studies which may have had methodological issues, attenuating the strength of the conclusion. 

More modern research suggests that the risks of alcohol consumption often outweigh any potential benefits. [^4]

The large gap between the levels of consumption may introduce bias to the model.

The most popular form of transportation in the dataset is the bus, with 1,573 individuals using it. In contrast, only 6 individuals rely on bicycles. This disparity may suggest that the data was collected from urban areas where buses are a common mode of transportation, while cycling is less prevalent. 

This could also provide insights into the overall physical activity levels of the sample, as reliance on buses may correlate with lower physical activeness compared to cycling. 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/fitness_level.jpg]]

Rather than going off of a conjecture, the exercise bar graph shows that 716 individuals do not exercise, 773 individuals rarely exercise, 493 moderate exercises, and 118 regularly exercises.

## Bivariate Analysis

### Age and Cardiovascular Risk Levels

![[content/Data Analysis & Machine Learning/images/Cardiovascular/age_cardiovascular.jpg]]

The boxplot for the low-risk category shows that most individuals in this group are younger, with the median age being lower than the other categories. The range of ages in this group is also narrow, with a few outliers extending to older ages.

On the other hand, the medium-risk category displays a wider age range, with its median age positioned slightly higher than the low-risk boxplot. The distribution of age also suggests that individuals in this group are more diverse, with several outliers.

### BMI and Cardiovascular Risk

![[content/Data Analysis & Machine Learning/images/Cardiovascular/bmi_cardiovascular_risk.jpg]]

The scatter graph suggests correlations between BMI and cardiovascular risk. Based on the scatter graph, individuals with lower BMI have lower risks of developing cardiovascular diseases while individuals with higher BMI have higher cardiovascular risk. 

### Gender and Cardiovascular Risk 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/gender_cardiovascular.jpg]]

The graph indicates that the spread of cardiovascular risk between the two genders is evenly distributed. Both females and males have the highest count in the high-risk category, with counts reaching 500, indicating that high cardiovascular risk is prevalent in both genders. However, 
there are more medium-risk category counts in males compared to females. There are also lesser males with low-risk category compared to females. 

### Lifestyle and Cardiovascular Risk

![[content/Data Analysis & Machine Learning/images/Cardiovascular/lifetstyle_cardiovascular.jpg]]

It can be observed that a significant portion of individuals who consume low volumes of alcohol have higher cardiovascular risks, indicating that there are other factors - activeness and diet - at play. 

The same can be said to smoking, snack consumption rate, and tv as well; majority of individuals who do not smoke, indulge in snacks sometimes, and rarely watch tv fall in the high cardiovascular risk category.  

Individuals who do not exercise have fall into high cardiovascular risk categories in contrast to individuals who regularly exercise.[^5] Individuals who take passive transportation have much larger cardiovascular risk as opposed to those who take active transportation.[^6]

Majority of individuals who admitted to consuming junk food fall into high cardiovascular risk category.[^7]Finally, individuals believe they do not have discipline have higher cardiovascular risk compared to those who do. 

## Potential Issues

The analysis reveals several patterns between lifestyle factors and cardiovascular risk, such as alcohol consumption, and cardiovascular risk levels. For instance, a significant proportion of individuals who consume low amounts of alcohol are categorized as having a high cardiovascular risk. Such findings may hold some truth, but the topic remains highly debated, and further research is necessary.

However, it can be conjectured that these observed relationships may be driven by the distribution of the data rather than representing genuine causal links between 
the features and the label. This highlights the importance of careful consideration when interpreting correlations 
in data, as they might be influenced by the distribution rather than a direct cause-and-effect relationship. To fix this issue, more data must be gathered to ensure that each group has equal representation and the relationship between the feature and label is more realistic and accurate.

# Data Cleaning and Pre-processing

Due to the highly skewed distribution in numerical data (age, height, weight, and exercise), there are a lot of outliers in the dataset. Before removing outliers, height and weight are first combined into BMI as BMI gives a more meaningful measurement of body fat relative to height and weight. If outliers from weight and height are removed before combining into BMI, we may overlook how these two features interact. If observed separately, the values in weight and height may seem extreme but, combined, may look normal.

*Snippet: Manipulating Features*
```python
# Combining Weight and Height to form BMI
cardio_df['BMI'] = (cardio_df['Weight(kg)']/ np.square(cardio_df['Height(cm)']/100)).apply(lambda x:round(x,2))

# Function to discretise age
def discretise_age(data:pd.DataFrame)->None:
    data['age_cat'] = pd.cut(data['Age'], bins = [13, 20, 25, 30, data['Age'].max()], labels=[1,2,3,4])
```

*Snippet: Removing outliers*
```python
# Define a function to remove outliers using the IQR method
def remove_outliers_iqr(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]

# Apply outlier removal for the numerical columns
numerical_columns = ['Age', 'BMI', 'Exercise']

# Removing outliers from the dataset
cleaned_data = cardio_df.copy()
for col in numerical_columns:
    cleaned_data = remove_outliers_iqr(cleaned_data, col)
    
# Display the number of rows removed due to outliers
removed_rows = len(cardio_df) - len(cleaned_data)
removed_rows, cleaned_data.head()
```

*Output*
```txt
(158,
    Gender  Age  Height(cm)  Weight(kg) Family_history Alcohol Junk_food  \
 1  Female   19       175.3        80.0            yes    none       yes   
 3  Female   23       165.0        70.0            yes     low        no   
 4    Male   23       169.0        75.0            yes     low       yes   
 5    Male   23       172.0        82.0            yes     low       yes   
 6  Female   21       172.0       133.9            yes     low       yes   
 
    Vege_day  Meals_day      Snack Smoking  Water_intake(L) Transportation  \
 1         2          1  Sometimes      no             2.65            bus   
 3         2          1  Sometimes      no             2.00            bus   
 4         3          3  Sometimes      no             2.82            bus   
 5         2          1  Sometimes      no             1.00            bus   
 6         3          3  Sometimes      no             2.42            bus   
 
    Exercise        TV  Income Discipline Cardiovascular_risk(y)    BMI  
 1         3  moderate    5551         no                 medium  26.03  
 3         0      rare    9451         no                 medium  25.71  
 4         1     often   17857         no                 medium  26.26  
 5         1  moderate    3114         no                 medium  27.72  
 6         2  moderate    8011         no                   high  45.26  )
```

Then, the dataset is divided into features and labels before splitting into training and test sets using the `train_test_split` method from `sklearn`. `stratify = y_cardio_df` is used to ensure that both training set and test set have equal rows of label data. The size of the test set is **20%** of the entire dataset. 

Age data remain right-skewed so, discretising them is beneficial to ensure each age group gets equal representation.

![[content/Data Analysis & Machine Learning/images/Cardiovascular/age_category.jpg]]

In our chosen features, there are 6 features with nominal data and 3 features with ordinal data. In the 6 features with nominal data, 5 – gender, family, junk food, smoking, and discipline - will be pre-processed with `LabelBinarizer` because their data consists of yes or no, or male or female. `OneHotEncoder` would not be suitable as it just adds unnecessary complexities when dealing with binary features. Transportation will be encoded with `OneHotEncoder`. `OrdinalEncoder` will be used on alcohol, tv, and snack. Finally, for better performance, cardiovascular risk will also be encoded with ordinal encoder.

# Methodology

## Model Training

Based on the dataset presented, this is a supervised, offline, multi-class classification problem. The models selected are, k-nearest neighbours, an extended logistic regression, and random forest. The main performance measure used to assess the models are confusion matrix, 
precision, recall, F1 Score, and AUC-ROC graph. 
K-fold cross validation is used when in training the model. This is done manually with `StratifiedKFold` to give us more control over the type of metrics to measure in assessing the performance of the model. 

>[!NOTE] Side Note
>Now that I've done it, `StratifiedKFold` wasn't really necessary. 

### K-Nearest Neighbours

K-nn can handle multiclass classification problems. Additionally, k-nn works well with a relatively small dataset of only 1.9 thousand rows of data. K-nn is a non-parametric algorithm, meaning it does not assume any underlying data distribution. This makes them more versatile for various data types and distributions. 

Predictions are made based on simple majority vote of the nearest neighbours of each point. The number of nearest neighbours to consider is important when classifying the output. A high number of neighbours to consider means the algorithm is more sensitive to the local structure, subtle patterns and variations in the data but, the is more likely to overfit while a lower number may give better generalization but risk underfitting. Additionally, to determine whether a point is to be regarded a neighbour, distance metrics are used. There are 3 common distance metrics to consider, Euclidean distance, Manhattan distance, and Minkowski distance. 

#### Training the Model

The default hyperparameters for sklearn’s knn model are 5 numbers of neighbours, uniform weight, and Euclidean distance metric.
```text
Cross-Validation Accuracy Scores:
[0.9839228295819936, 0.9871382636655949, 0.9903536977491961, 0.9935483870967742, 0.9806451612903225]
Average Accuracy: 0.9871216678767762

Cross-Validation Precision Scores:
[0.9838980209559758, 0.9872878187392506, 0.9906863288612929, 0.9935483870967742, 0.9819499818774917]
Average Precision: 0.9874741075061572

Cross-Validation Recall Scores:
[0.9839228295819936, 0.9871382636655949, 0.9903536977491961, 0.9935483870967742, 0.9806451612903225]
Average Recall: 0.9871216678767762

Cross-Validation F1 Scores:
[0.9838693545172303, 0.9871400029132399, 0.9903546759767846, 0.9935483870967742, 0.9806371235666059]
Average F1: 0.987109908814127
```

*The result from the k-fold cross validation is quite promising.* 

```text
Metrics after training on the entire training set:
Accuracy: 0.9961365099806826
F1: 0.9961367210034928
Precision: 0.9961429103417135
Recall: 0.9961365099806826
```

^3ee372

#### Evaluation of Training Result

*Classification Report*
```text
				  precision   recall  f1-score   support
	       low       1.00      0.99      0.99       439
	    medium       0.99      1.00      0.99       417
          high       1.00      1.00      1.00       697
      
      accuracy                           1.00      1553
     macro avg       1.00      1.00      1.00      1553
  weighted avg       1.00      1.00      1.00      1553
```

![[content/Data Analysis & Machine Learning/images/Cardiovascular/knn_confusion_matrix.jpg]]

According to the confusion matrix, most misclassification occurs in the low-risk – 4 false negatives and 2 false positives - and medium-risk – 2 false negatives and 4 false positives - category.

![[content/Data Analysis & Machine Learning/images/Cardiovascular/knn_learning_curve.jpg]]

The learning curve shows that the training score starts high and remains consistent throughout, except for a small initial dip, before stabilising at a high level. Such performance indicates some overfitting initially. The validation score starts much lower than the training score but, as the number of samples increases, the validation score improves significantly, showing that the data generalises well as it sees more data. The gap between training score and validation score also decreases as the training examples increase, indicating improved generalization. 

### Logistic Regression

Logistic regression is naturally a binary classifier; however, logistic regression can be extended to handle multiclass classification. 

In OvR, 3 binary Logistic regression model is trained, one for each cardiovascular risk - low-risk detector, medium-risk detector, and high-risk detector. Then, to classify an individual, the class whose classifier outputs the highest score is selected. 
#### Training the Model

The initial parameters used to train the model are:

*Snippet: Extended logistic regression*
```python
model = OneVsRestClassifier(LogisticRegression(solver='lbfgs', max_iter=5000, penalty='l2', class_weight='balanced'))
```

K-fold cross validation is still used. 

```text
Cross-Validation Accuracy Scores: [0.977491961414791, 0.9935691318327974, 0.9870967741935484, 0.9838709677419355, 0.9838709677419355]
Average Accuracy: 0.9851799605850016

Cross-Validation Precision Scores: [np.float64(0.9774732279819921), np.float64(0.9935691318327974), np.float64(0.9874423963133642), np.float64(0.983815331010453), np.float64(0.9839490968801314)]
Average Precision: 0.9852498368037477

Cross-Validation Recall Scores:[0.977491961414791, 0.9935691318327974, 0.9870967741935484, 0.9838709677419355, 0.9838709677419355]
Average Recall: 0.9851799605850016

Cross-Validation F1 Scores: [np.float64(0.97744180336778), np.float64(0.9935691318327974), np.float64(0.9870272108248518), np.float64(0.9838278729017544), np.float64(0.9838916084880929)]
Average F1 score: 0.9851515254830552
```

*The result from the k-fold cross validation is quite promising.* 

```text
Model evaluation after training with the training set:
Accuracy: 0.9922680412371134
Precision: 0.9922562076504403
Recall: 0.9922680412371134
F1 score: 0.9922596724505841
```

^919a2a

#### Evaluation of Training Result

*Classification Report*
```text
				precision    recall  f1-score   support
         low       0.99      0.99      0.99       439
	  medium       0.99      0.98      0.99       417
        high       1.00      1.00      1.00       696

    accuracy                           0.99      1552
   macro avg       0.99      0.99      0.99      1552
weighted avg       0.99      0.99      0.99      1552
```

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_confusion_matrix.png]]

Based on the confusion matrix, the model makes the most misclassifications when attempting to predict medium-risk category with 7 false negatives and 5 true positives. 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_learning_curve.png]]

Similar to the training curve from the KNN model, the model initially overfitted, with a very high training score, but dips as the number of data introduced increases. The validation score starts out much lower than the training score but improves as more data is used, indicating the model’s improvement at generalisation. The gap between training score and validation score at the end does reduce, but it would still benefit from more data or fine-tuning to further close the gap. 

The model's performance on the validation set fluctuates more when examples are small as denoted by the wider green shaded area. %% The variance fluctuates the most between 400 and 800 training samples; however, the uncertainty does reduce as more training data is added, indicating that the model is becoming more stable at generalizing %%

### Random Forest 

Random Forest is a machine learning algorithm can be used for classification or regression task, creating a collection of decision trees (forest), each trained on random subsets of the data. It performs well on small datasets by averaging multiple decision trees, which 
reduces overfitting.

Moreover, its robustness to noisy data improves accuracy and stability, while its ability to manage multi-class classification makes it suitable for three-category task - low, medium, and high. This combination of simplicity, interpretability, and performance makes Random Forest 
a strong option. In addition, random forest is helpful for feature selection. It ranks the importance of 
each feature and help determine which features have the greatest impact on the prediction, making it useful in data analysis and interpretation.

#### Training the Model

The default settings include 100 decision trees, Gini impurity as the criterion for splitting, and no limit on tree depth, allowing the trees to grow until all leaves 
are pure or contain fewer than the minimum number of samples required for splitting.

*K-fold cross validation is still used.* 
```txt
Cross-Validation Accuracy Scores:
[1.0, 1.0, 1.0, 1.0, 1.0]
Average Accuracy: 1.0

Cross-Validation Precision Scores:
[1.0, 1.0, 1.0, 1.0, 1.0]
Average Precision: 1.0

Cross-Validation Recall Scores:
[1.0, 1.0, 1.0, 1.0, 1.0]
Average Recall: 1.0

Cross-Validation F1 Scores:
[1.0, 1.0, 1.0, 1.0, 1.0]
Average F1: 1.0
```

```txt
Training Model:
Accuracy: 1.0
Precision: 1.0
Recall: 1.0
F1: 1.0
```

^b2711e

Although the k-fold cross validation and the overall training metrics looks *perfect*, it may indicate that the model has overfitted. 

#### Evaluation of Training Result

```txt
precision    recall  f1-score   support

         low       1.00      1.00      1.00       439
      medium       1.00      1.00      1.00       417
        high       1.00      1.00      1.00       697

    accuracy                           1.00      1553
   macro avg       1.00      1.00      1.00      1553
weighted avg       1.00      1.00      1.00      1553
```

![[content/Data Analysis & Machine Learning/images/Cardiovascular/random_forest_confusion_matrix.png]]

Based on the confusion matrix, the random forest model gave a perfect training result with zero misclassification across all three level of risks. As great as this is, this may indicate overfitting of the model. 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/random_forest_learning_curve.png]]

The training score remains 1.0 throughout the sample size, but the validation score changes. There is also an absence of a shaded area between the training and validation learning curves; this likely means that the generalisation gap of the model is small. 

## Model Testing

Before testing the model, the same pre-processing is done on the testing datasets.  

### K-Nearest Neighbours

```txt
Testing Metrics:
Accuracy: 0.987146529562982
Precision: 0.987736138298625
Recall: 0.987146529562982
F1: 0.9871479329334849
```

![[Cardiovascular Risk Analysis#^3ee372]]

Comparing the two metrices, the performance of the model on unseen data is consistent with the performance on training data. 


![[content/Data Analysis & Machine Learning/images/Cardiovascular/knn_test_confusion_matrix.png]]

In comparison to the training confusion matrix, there is not much disparity in the performance. There are only 5 misclassifications that the model makes - misclassifying medium risk as low risk 5 times. 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/knn_roc_auc.png]]

The AUC ROC curve show that the AUC for each level of cardiovascular risks is consistently reaching 1.000. This means that the model is capable of distinguishing the three classes apart from each other. The AUC for high risk being 1 tallies with the perfect prediction as shown in the confusion matrix, while there exists minor misclassification between low and high cardiovascular risk. 

With the testing result being comparable to training result, this indicates that the model has not overfitted and learnt well.

Overall, based on the metrics, confusion matrix, and the AUC ROC curve, the model has not overfitted and is a good candidate for the problem. 
### Logistic Regression

```text
Testing evalution: 
Accuracy: 0.9897172236503856
Precision: 0.9897082455173656
Recall: 0.9897172236503856
F1 score: 0.9897032781140256
```

![[Cardiovascular Risk Analysis#^919a2a]]

Comparing the two metrices, the performance of the model on unseen data is also consistent with the performance on training data.

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_regression_test_matrix.png]]

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_regression_ROC_curve.png]]

For the ROC AUC Curve, the model demonstrates a good performance in in distinguishing between 
the three categories. However, there exists misclassification across all three level of cardiovascular risks. 

Overall, based on the metrics, confusion matrix, and the AUC ROC curve, the model has not overfitted and is a good candidate for the problem. 

### Random Forest

```txt
Testing Model:
Accuracy: 0.9897172236503856
Precision: 0.9897082455173656
Recall: 0.9897172236503856
F1: 0.9897032781140256
```

![[Cardiovascular Risk Analysis#^b2711e]]

The metrics dropped when the model is being used on unseen data, but still remains consistently high. 

![[content/Data Analysis & Machine Learning/images/Cardiovascular/random_forest_test_matrix.jpg]]

![[content/Data Analysis & Machine Learning/images/Cardiovascular/random_forest_test_AUC.jpg]]

The confusion matrix for the test data shows that the 
model performs well but not perfectly when applied to new data. Specifically, 108 instances of Low risk were correctly classified, with 2 misclassified as Medium and none as High. For the Medium risk category, 103 instances were correctly predicted, while 1 Low was misclassified. In the High-risk category, the model correctly classified all 175 instances with no misclassifications. While the misclassifications in the Low and Medium categories are 
minimal, the overall performance remains very strong.

The ROC AUC curve shows  nearly perfect discrimination between the risk categories. The area under the curve (AUC) values for Low, Medium, and High are 0.9992, 0.9990, and 1.0000, respectively. These near-ideal AUC scores indicate that the model has excellent predictive capabilities, with a very low false positive rate and a high true positive rate across all risk categories.

Overall, based on the metrics, confusion matrix, and the AUC ROC curve, the model has not overfitted and is a good candidate for the problem. 

## Model Fine-Tuning

`GridSearch` is used for fine-tuning the model. 

### K-Nearest Neighbours

2 main hyperparameters – `n_neighbours` and `distance` metric - will be considered during fine-tuning. The fine tuning will be done with `GridSearch`. After fine tuning, it is found that the best KNN model uses Manhattan distance metric and considers 8 nearest neighbours. 

F1 score improves slightly with the new, fine-tuned model but precision dips slightly.

Tuned Metrics:
```tx
|  Metrics (weighted)  |  Average  |
  -------------------  |  -------  |
|  Accuracy            |  0.987147 |
|  Precision           |  0.987387 |
|  Recall              |  0.987147 |
|  $\text{F}_1$ Score  |  0.987187 |
```
![[content/Data Analysis & Machine Learning/images/Cardiovascular/knn_fine_tune_matrix.jpg]]

![[content/Data Analysis & Machine Learning/images/Cardiovascular/knn_fine_tune_roc_auc.jpg]]

According to the fine-tuned model, the most misclassifications still happen in medium￾risk category and low-risk category with 1 false negative and 4 false positives. However, looking at the ROC AUC curve, the AUC for low-risk category dipped but improved slightly for medium risk category. Overall, the performance of the fine-tuned model improved with a rather negligible amount.

### Logistic Regression

During fine tuning stage, we are focusing on five main hyperparameters: 
1. `regularization strength`
2. `penalty` 
3. `maximum iterations`
4. `solver options`
5. `class weight`

Since the model is extended to One-vs-Rest (OvR), only the solvers that support this multiclass classification are used. 

Additionally, since the dataset contains only 1.9k samples (after trimming), which is considered a rather small dataset, `sag` and `saga` solvers are not used, because these solvers are better suited for larger datasets.

Since the solvers used  support separate penalties, fine-tuning is done separately for both solvers. 

`liblinear` can support both `l1` and `l2` penalty while `lbfgs` can only support `l2` penalty.

After performing fine tuning, it is shown that the best parameters to form the best logistic regression model are:
- `C: 0.1`
- `max_iter: 5000`
- `penalty: l2`
- `solver: lbfgs`
- `class_weight: balanced`

```tx
|  Metrics (weighted)  |  Average  |
  -------------------  |  -------  |
|  Accuracy            |  0.989717 |
|  Precision           |  0.989708 |
|  Recall              |  0.989717 |
|  $\text{F}_1$ Score  |  0.989703 |
```

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_regression_fine_tune_matrix.jpg]]

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_regression_fine_tune_auc_roc.jpg]]

The Fined Tuned Confusion Matrix is similar to the Testing Confusion Matrix. Based on the ROC AUC Curve, there is a small improvement in the model's ability to differentiate 
these 3 categories. However, for the low-risk category continues to have the lowest score among the 3 categories.

The best parameter for the other solver, `liblinear`, are:
- `C: 0.1`
- `max_iter: 5000`
- `penalty: l1`
- `solver: liblinear`
- `class_weight: balanced.`

However, this version does not perform as well as the former. 

```tx
|  Metrics (weighted)  |  Average  |
  -------------------  |  -------  |
|  Accuracy            |  0.958869 |
|  Precision           |  0.958757 |
|  Recall              |  0.958869 |
|  $\text{F}_1$ Score  |  0.958804 |
```

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_regression_fine_tune_matrix_2.jpg]]

![[content/Data Analysis & Machine Learning/images/Cardiovascular/logistic_regression_fine_tune_aoc_roc_2.jpg]]

The model makes the most mistakes in distinguishing between low and medium categories. The ROC AUC curve shows that the model has a harder time predicting medium￾risk category compared to predicting low-risk or high-risk categories. According to the confusion matrix, 7 false positives are made and 6 false negatives are made when classifying medium-risk category. 

### Random Forest

The fine-tuning involves  evaluating 576 different combinations of parameters, using 5-fold cross-validation, which resulted in a total of 2,880 model fits. 

The grid search explored parameters: 
- `max_depth`
- `max_features` 
- `min_samples_leaf`
- `min_samples_split`
- `n_estimators`

```tx
|  Metrics (weighted)  |  Average  |
  -------------------  |  -------  |
|  Accuracy            |  0.992288 |
|  Precision           |  0.992313 |
|  Recall              |  0.992288 |
|  $\text{F}_1$ Score  |  0.992289 |
```

![[content/Data Analysis & Machine Learning/images/Cardiovascular/rf_fine_tune_matrix.jpg]]

![[content/Data Analysis & Machine Learning/images/Cardiovascular/rf_fine_tune_roc_auc.jpg]]

The fine tuned confusion matrix remains the same as the testing confusion matrix, while the ROC AUC scores for tunned shows near-perfect performance. However, there is a slight variation in the AUC values between the two testing 
scenarios. The AUC for the Low category slightly increased from 0.9992 to 0.9994. Conversely, the AUC for the Medium category decreased from 0.9990 to 0.9988. The AUC for the High category remains consistently perfect at 1.0 in both cases, indicating exceptional performance in distinguishing the High class from the others across both tests.

# Results and Findings

According to the fine-tuned version of the each model, 

```tx 
| Models | K-NN | Logistic Regression (solvers) || Random Forest||
|  ^^    |  ^^  | liblinear with l1 penalty     | lbfgs with l2 penalty |^^|
-------- | ---- | :----------------------------: | ------------:|
Recall (weighted)    | 0.987147 | 0.958869 | 0.989717  | 0.992288 |
Precision (weighted) | 0.987387 | 0.958757 | 0.989708  | 0.992313 |
F1 Score (weighted)  | 0.987187 | 0.958804 | 0.989703  | 0.992289 |
```

According to these metrics, the random forest model performs the best with the highest values across all metrics, followed by logistic regression model with `lbfgs` solver and `k-nn` comes in last. The logistic regression model with “`liblinear`” solver performs the worst amongst all 4, albeit recording values above 0.9. 

According to the confusion matrices, random forest makes the least mistakes in predicting cardiovascular risks whereas logistic regression with `liblinear` solver makes the most mistakes. Nonetheless, all of these models have something in common, most misclassifications in prediction happens between low-risk and medium-risk categories compared to high-risk categories. This may be attributed to to the uneven distribution – the domination of high-risk category - of the cardiovascular risks in the dataset, leading to poorer performance on the minority classes. This may also be the reason as to why `liblinear` solver performs so poorly; it is more sensitive to the distribution of classes. 

## Feature Importance

According to random forest, 

| Feature                   | Importance |
| ------------------------- | ---------- |
| BMI                       | 0.722390   |
| Snack                     | 0.073774   |
| Family_history            | 0.066922   |
| Age_category              | 0.036632   |
| Junk_food                 | 0.017905   |
| Exercise                  | 0.014685   |
| Alcohol                   | 0.012645   |
| TV                        | 0.010880   |
| Gender                    | 0.010778   |
| Transportation_bus        | 0.008732   |
| Discipline                | 0.008573   |
| Transportation_car        | 0.007792   |
| Transportation_walk       | 0.004583   |
| Smoking                   | 0.003164   |
| Transportation_motorcycle | 0.000376   |
| Transportation_bicycle    | 0.000170   |

![[content/Data Analysis & Machine Learning/images/Cardiovascular/random_forest_feature_importance.jpg]]

BMI is the most important factor in predicting cardiovascular risk, with an importance 
score close to 0.75, indicating it has a major influence on the model's performance, while other features seem to play very minor role. 

# Discussion and Conclusion
## Strength and Weakness

### K-Nearest Neighbours

#### Strengths

It is a simple model that is easy to implement and understand. No assumption is made about the distribution of the data, making it useful for data that does not follow standard distributions.

#### Weakness

K-nn can be affected by the dimensionality of data, particularly, datasets with a lot of features. As the number of features grow, the volume of the space grows, causing the available data points to be farther apart from each other. This makes it difficult to find meaningful nearest neighbours, as there may be fewer neighbouring points within a given distance. Furthermore, as the number of dimensions increases, the distance between any two points tends to become more uniform due to the diminishing influence of any single dimension. 

### Logistic Regression

#### Strengths

Logistic regression is a powerful and easy implement model that uses probabilistic interpretation of classification. It works well with linearly separable data and can handle 
multiple class through the methods such as multinomial or one-versus-rest (OVA) regression. At the same time, it has `L1` and `L2` techniques to be regularized to address overfitting issue. 

#### Weakness

However, logistic regression has a few main limitations. It assumes a linear relationship between the features and the outcomes. This means that it might not fit real- world 
data that comes with more complex pattern. Moreover, it is not suitable for predicting continuous values and classify non-linearly separable data.

### Random Forest

#### Strengths

Random Forest classification model can be an effective choice for analysing and predicting results especially for a dataset with less than 2.1k rows and 17 features. This method utilizes an ensemble of decision trees to make predictions based on various feature combinations, significantly reducing the risk of overfitting. One of the main strengths of it is ability to evaluate feature importance, which helps determine which features have most significant impact on predictions.

#### Weakness

Random Forest model’s complexity can result in longer computation times, particularly as the size of the dataset or the number of tress increase. This may be a limitation when working with larger or more computationally demanding task.


[^1]: [Family History, Heart Disease and Stroke](https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease/family-history-and-heart-disease-stroke)
[^2]: [Heart Disease Family History](https://www.cdc.gov/heart-disease-family-history/risk-factors/index.html)
[^3]: [Moderate Drinking and Reduced Risk of Heart Disease](https://pmc.ncbi.nlm.nih.gov/articles/PMC6761693/)
[^4]: [No Level of Alcohol Consumption is Safe for Our Health](https://www.who.int/europe/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health#:~:text=The%20World%20Health%20Organization%20has,no%20safe%20amount%20that%20does)
[^5]: [Physical Activity and Your Heart - Benefits](https://www.nhlbi.nih.gov/health/heart/physical-activity/benefits)
[^6]: [Associations of Public Transportation Use With Cardiometabolic Health: A Systematic Review and Meta-Analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC6438807/)
[^7]: [Why junk food diets may raise heart disease risk](https://www.health.harvard.edu/heart-health/why-junk-food-diets-may-raise-heart-disease-risk)