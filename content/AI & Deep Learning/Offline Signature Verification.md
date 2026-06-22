---
id: Offline Signature Verification
aliases: []
tags:
- deep-metric-learning,
- cnn,
- loss-function,
- python
draft: false
title: Offline Signature Verification
---

<div class="page-links">
    <a href="https://sct-signature-demo.streamlit.app/" target="_blank" rel="noopener noreferrer" style="color:#92BFDB"> demo site </a>
    <a href = "https://github.com/HappyPotatoHead/signature-verification-sct-plus" target="_blank" rel="noopener noreferrer"style="color:#92BFDB"> source code </a>
</div>

> This project has come to an end as I pursue other endeavours - 18/06/2026
>
> Maybe I'll return and expand upon on this in the future.
>
> My university publishes students' fyp in its institutional repository, I will link it when it's added
> _[[Offline Signature Verification#Results|Skip to Result]]_

# Project Overview

This project utilises _EfficientNetV2_ [^1] as the feature extraction backbone and is complemented with a custom loss function inspired from _Hard negative examples are hard, but useful_[^2], $L_{SC+}$. This project also utilises an extended version of the conventional $PK$ sampling technique, $PKFM$.

All of these choices were made according to existing research and reading materials. This project was made to address known limitations and challenges of utilising deep learning models in offline signature verification.

> [!Example] Challenges in this domain
>
> - High intra-class variability
> - High inter-class similarity
> - Poor computational efficiency
> - Imbalance of real-world training data

The primary objective of this project is to **improve intra-class generalisability** while **ensuring skilled forgeries' discriminatory ability remains strong**.

> [!WARNING] Out of Scope
>
> 1.  Digitally drawn signatures
> 2.  Electronic Signatures
> 3.  Non-Latin languages
> 4.  Accuracy when poor quality images are used
> 5.  Writer dependent verification
> 6.  Signature extraction

> [!QUOTE] Oversight
> Like all models placed in critical systems, they can sometimes make potentially disastrous mistakes and require human oversight.

# Problems

To the best of my knowledge, albeit _admittedly limited_, offline signature verification are still primarily driven by manual work. (_I was informed of this during my internship_)

Unlike machines, humans can't operate on high volumes of documents at high speed over a long, continuous period of time. Since signatures are still used in important documents, particularly in financial, legal, and administrative contexts, errors are very often unacceptable.

Deep learning approaches often struggle with high intra-class variability and highly similar skilled forgeries.
To deal with this, a lot of approaches _cheat_ by implementing additional methods or models on top of their existing deep learning architecture and pipeline.
This is not to fault the authors, but I do believe that there are still more optimisation that we have yet to implement.

If developers aren't careful enough, OSV models that utilise the conventional triplet loss approach [^3] can suffer from poor optimisation, wasting resources; most of the time [^2], the positive samples are already closer to the anchors than the negatives, leading to over-optimisation of anchor-positive pairs and causing poor generalisability towards intra-class signatures.

# Approach

## Pre-Processing Images

> [!TLDR]
> RGB format is unnecessary
>
> Binary format was opted for and it was achieved with Otsu's thresholding

What we primarily want from the signature images are the strokes; thus, colours don't play much of a role.
RGB format would only provide irrelevant colour information, increasing computation power and possibly interfering with the model's ability to extract relevant feature embeddings.
On the contrary, grasyscale or binary format forces the model to focus solely on the strokes of the signatures by enhancing the contrast between the foreground and the background.
It also minimises paper artefacts, reducing noise in each image.

Although greyscale format reduces unnecessary information, it may make the foreground less discernible from the background.
To make the strokes _pop out_, I went with Otsu's binarisation technique [^4].
This techinque automatically determines the optimal global threshold needed to convert the grayscale image into a binary image.

For example [^5],

| Before                            | After                           |
| --------------------------------- | ------------------------------- |
| ![[unprocessed_original_1_1.png]] | ![[processed_original_1_1.png]] |

Unfortunately, I couldn't solve the issue of lacking signature images that plagues this domain;
however, this glaring issue may be mitigated by artificially boosting the number of training samples with data augmentation - resizing, rotation, scaling, and translation.

| Example 1                      | Example 2                      |
| ------------------------------ | ------------------------------ |
| ![[data_augmentation_one.png]] | ![[data_augmentation_two.png]] |

> [!Example]- Code Snippet
>
> ```python
> TRAIN_TRANSFORM = transforms.Compose([
>        transforms.Resize((384, 384)),
>        transforms.RandomAffine(
>            degrees=(-5, 5),
>            translate=(0.1, 0.1),
>            scale=(0.95, 1.05),
>            shear=(-5, 5)
>        ),
>
>        transforms.RandomResizedCrop(
>            (384, 384),
>            scale=(0.9, 1.05),
>            ratio=(0.95, 1.05),
>            antialias=True
>        ),
>        transforms.ToTensor(),
>        transforms.Normalize(
>            mean=[0.5], std=[0.5]
>    )])
>
> TEST_TRANSFORM = transforms.Compose([
>        transforms.Resize((384, 384)),
>        transforms.ToTensor(),
>        transforms.Normalize(
>            mean=[0.5], std=[0.5]
>    )])
> ```

## Backbone

Training a CNN model from scratch would require tens of thousands to millions of examples to reach a satisfactory accuracy.
It would also require extensive compute power, something that I don't possess.
Fortunately, I leverage existing state-of-the-art models via transfer learning to speed up the training process while ensuring satisfactory accuracy.

`PyTorch` offers A LOT of pretrained CNN models [^6]

> [!EXAMPLE]- Pretrained Models
>
> ```zsh
> - AlexNet
> - ConvNeXt
> - DenseNet
> - EfficientNet
> - EfficientNetV2
> - GoogLeNet
> - Inception V3
> - MaxVit
> - MNASNet
> - MobileNet V2
> - MobileNet V3
> - RegNet
> - ResNet
> - ResNeXt
> - ShuffleNet V2
> - SqueezeNet
> - SwinTransformer
> - VGG
> - VisionTransformer
> - Wide ResNet
> ```

After doing some reading [^1] [^7], EfficientNetV2 was the top pick. The model improved upon EfficientNetV1, balancing computation efficiency with performance - this model performs $11 \times$ faster while being $6.8 \times$ smaller.
Amongst the three available EfficientNetV2 variants, the mid-size variant offers the strongest balance between computation cost and performance; the largest variant contains more than twice the parameters of the mid-variant, yet it yielded only marginally better performance on ImageNet [^1].

| Models           | Top-1 Accuracy (%) | Parameters |
| ---------------- | ------------------ | ---------- |
| EfficientNetV2-S | 83.9               | 22M        |
| EfficientNetV2-M | 85.1               | 54M        |
| EfficientNetV2-L | 85.7               | 120M       |

I removed the classification head and replaced it with project layers that reduce the feature vectors to 256 dimensions.

> [!QUESTION]- Why 256?
> **Short answer**:
>
> It's a nice middle ground
>
> **Long answer**:
>
> A 256-dimension offers a rich yet efficient feature space for encoding patterns.
> Since signature images are relatively simple, there is no need for a higher level of dimensions, as a higher dimension can lead to redundancy.

## Loss Function

### Triplet Loss

The conventional loss function is as follows:

1. There are three nodes, collectively called a triplet, comprising an anchor, a genuine signature (positive), and a forged signature or an inter-class signature (negative).
2. The goal is to pull similar images (anchor and positive) closer while pushing dissimilar images (anchor and negative) away.
   - This is achieved by ensuring that the anchor is slower to the positive than it is to the negative by at least a margin ($\alpha$)

$$

\begin{align}
D_{ap} + \alpha < D_{an}
\end{align}


$$

![[ideal_triplet_mining.png]]

However, the triplets generated may have already satisfied this condition, slowing down convergence if these triplets are still passed through the network.
To address this, the authors behind _Hard negative examples are hard, but useful_ [^2] introduced online triplet mining to dynamically compute the triplets as training progresses.
They achieved this by constructing large mini-batches that contain multiple examples per identity, selecting anchor-positive pairs from within the batch, and then dynamically identifying negatives.

- For hard triplets, the negative is chosen as the closest impostor to the anchor.
- For semi-hard triplets, the negative is farther than the positive but still lies within the margin.

| Hard Triplet                 | Semi Hard Triplet                 |
| ---------------------------- | --------------------------------- |
| ![[hard_triplet_mining.png]] | ![[semi_hard_triplet_mining.png]] |

This paper is particularly important as it shows that this loss function is ideal for verification problems involving negative samples.
Their online mining approach also led to countless inspirations down the line.

I decided to implement this loss function in conjunction to the custom loss function that I will be implementing.

### $L_{SC}+$

> This loss function is an extension of _Hard negative examples are hard, but useful_[^2]

The authors of _Hard negative examples are hard, but useful_ noticed that the conventional triplet loss function exhibits a couple of issues: poor optimisation and gradient entanglement.
They proposed to simply ignore anchor-positive pairs and easy negatives to focus solely on penalising hard negatives.

Theoretically, this approach works well in the domain of offline signature verification; the high intra-class variation requires the model to have some degree of generalisability while maintaining a robust discriminatory ability.

However, there is a subtle failure if I just _drag-and-drop_ their implementation.
By removing the explicit constraint on anchor-positive similarity, the model is no longer encouraged to keep genuine signatures close together; over time, genuine embeddings can drift apart.
In practice, this can lead to a higher count of false negatives: a genuine signature sampled later may fall outside of the verification threshold, although it belongs to the same user.

To mitigate this, I introduced a lightweight positive constraint that softly enforces intra-class cohesion while retaining the hard-negative emphasis. This lets me utilise the benefits of the existing loss function while preventing genuine signatures from drifting too far apart.

$$
\begin{align}
L_{SC+} = L_{SC}(S_{ap}, S_{an}) + \mu L_{\text{pull}}
\end{align}
$$

Where:

- $L_{SC}$ is Selectively Contrastive Triplet Loss
- $L_{\text{pull}}$ is Positive Pull Regularisation
- $\mu$ is a hyperparameter weighing the positive pull

The $L_{SC}$ handles the inter-class separation, whereby it switches behaviour according to the difficulty of anchor-negative pairs.

$$
\begin{array}{r}
L_{SC}\left( S_{ap},S_{an} \right) = \left\{ \begin{array}{r}
\lambda S_{an}\  \\
L\left( S_{ap},S_{an} \right)
\end{array} \right.\ \begin{matrix}
if\ S_{an} > S_{ap} \\
otherwise
\end{matrix}
\end{array}
$$

Where:

- $S_{ap} = f_{a}^Tf_{p}$ is cosine similarity between anchor and positive
- $S_{an} = f_{a}^T F_{n}$ is cosine similarity between anchor and negative
- $\lambda$ is weighting factor for hard negatives

This is more computationally efficient compared to the standard triplet loss implementation.
If a negative sample is found to be closer to the anchor than the positive sample (a hard negative), the loss function switches and pushes the negative sample away from the anchor in the hypersphere; the negative sample will receive exponentially larger weighting in the loss function.
In contrast, when a negative sample is already sufficiently distant (an easy negative), the model does not incur any penalty and simply ignores it by switching to smooth, self-normalising log-softmax, receiving vanishingly small weights.

The $L_{\text{pull}}$ is defined as follows:

$$
\begin{array}{r}
L_{\text{pull}} = \left\{
\begin{array}{r}
m - S_{ap},  \\
0,
\end{array} \right.\
\begin{matrix}
if\ S_{ap} < m \\
\text{otherwise}
\end{matrix}
\end{array}
$$

Where:

- $m$ is margin

The margin is important to stop the model from over-optimising positives.
If a margin is not included, the model may ignore its initial purpose to maximise negative distances.
This subsequently leads to the collapse of the embedding space.
Once the anchor-positive similarity exceeds the threshold, the gradient from the positive pull becomes 0, allowing the model to focus on separating negatives.

## Dataset and Sampling

The dataset was split based on signer identity rather than individual images, ensuring that no signature from a given signer appeared in both training and testing sets.
This method of splitting prevents the leakage of testing images into training and enforces subject-independent evaluation.

In standard $PK$ sampling, a batch is formed by selecting $P$ signers and $K$ signatures per signer, controlling the balance between inter-class and intra-class samples; however, it lacks the control over hard negatives and easy negatives. $PKFM$ mapping introduces two additional parameters, $F$ and $M$, which regulates the number of intra-class and inter-class negatives, respectively. Increasing $F$ raises the likelihood of encountering hard negatives (skilled forgeries), while increasing $M$ introduces more easy negatives (inter-class negatives), thereby enriching the diversity of each batch.

The resulting batch size is:

$$
\begin{align}
\text{Batch Size} = P \times (K + F + M)
\end{align}
$$

From a practical standpoint, offline signature datasets are often imbalanced, with some signers contributing disproportionately more samples. If not handled with care, some signers experience stronger verification compared to signers with fewer signatures. $PKFM$ mitigates this issue by balancing the dataset at the batch level.

## Threshold Selection

The proposed model produces a cosine similarity score for each pair of signature images rather than directly outputting a binary class label. A higher similarity score indicates that the two signatures are closer in the embedding space, while a lower similarity score indicates that the pair is more likely to belong to different classes. Therefore, a decision threshold is required to convert the similarity score into a verification score. If the similarity score is greater than or equal to the threshold, the pair is classified as genuine; otherwise, it is classified as a forgery.

The decision threshold was selected for evaluation purposes using the Equal Error Rate (EER) operating point. First, genuine-pair similarity scores and forgery-pair similarity scores were computed from the evaluation set. The Receiver Operating Characteristic (ROC) curve was then generated by sweeping across possible threshold values. For each threshold, the False Positive Rate (FPR) and True Positive Rate (TPR) were computed. The False Negative Rate (FNR) was obtained as:

$$
FNR = 1 - TPR
$$

The selected threshold was the threshold where the absolute difference between FPR and FNR was minimised:

$$
t \; \text{*=} \arg{ \min{_{t}} \vert FPR(t) - FNR(t) \vert }
$$

At this operating point, the false acceptance and false rejection rates are approximately balanced. This threshold was then used to report the accuracy, true positive rate, false positive rate, and confusion matrix for each model.

It should be noted that this threshold is used as an evaluation operating point rather than universal deployment threshold. In a real-world deployment scenario, the threshold should be calibrated on a separate validation set according to application requirements. For example, a stricter threshold may be preferred when reducing false acceptance is more important, while a more lenient threshold may be used when reducing false rejection is prioritised. Since this project focuses on controlled model comparison, the EER operating point provides a balanced and consistent way to compare the different loss functions.

| Loss Function            | Selected Threshold |
| ------------------------ | ------------------ |
| Hard Triplet Mining      | 0.667              |
| Semi-Hard Triplet Mining | 0.777              |
| $L_{SC+}$                | 0.725              |

The reported accuracy should therefore be interpreted as the accuracy obtained at the EER operating threshold. In contrast, the AUC score remains threshold-independent and is used to evaluate the model’s overall ability to rank genuine pairs higher than forged pairs.

## Training

I implemented key features for training such as:

- **Early Stopping**
  - Monitors validation loss and automatically halts training if no significant improvement is observed over a set number of epochs, preventing overfitting
- **Learning Rate Scheduling**
  - Manages the adjustment of the learning rate throughout training to optimise convergence.
- **Checkpointing**
  - Automatically saves model snapshots - weights, and optimizer state - at key points when a new best validation loss is achieved, ensuring progress can be restored and the best model recovered.
- **Device Management:**
  - Handles moving data and the model to the GPU for accelerated computation.

To ensure a fair comparison of all the models, the configurations for the scheduler, optimiser and training, as well as the model, were kept mostly similar.
The margin hyperparameter was fixed at 0.5 across all loss functions, ensuring that the differences in performance were attributable to the loss formulation rather than margin selection.
The hyperparameters were also selected based on the recommended starting points. (_Can't afford extensive hyperparameter fine-tuning at the moment._)

For my run, I implemented a linear warm-up for the first 5 epochs, gradually increasing the learning rate from 0.0001 to 0.001, followed by a cosine decay learning rate schedule that smoothly reduces the rate to $1 \times 10^{-6}$. This method stabilises early training and enables fine-grained convergence .

# Results

## Hard Triplet Mining

Utilising batch hard mining, the model demonstrated the ability to separate negative samples from the positives.
At the commencement of training, the mean of _Attraction Term_ was higher than the Repulsion Term.
By the end of the training process, the model successfully minimised the Attraction Term from approximately $1.4 \text{to} 0.7$, while the Repulsion Term was consistently concentrated between $1.15 \text{and} 1.25$.

| Attraction Term                                      | Repulsion Term                                      |
| ---------------------------------------------------- | --------------------------------------------------- |
| ![[hard_triplet_mining_attraction_term_stacked.png]] | ![[hard_triplet_mining_repulsion_term_stacked.png]] |

The histograms further illustrated these favourable dynamics; the distribution of the Repulsion Term remained concentrated on the right side of the axis, while the Attrasction Term distribution successfully shifted to the left.
This increasing spatial separation the two density peaks provides clear visual evidence that the model learnt to distinguish between genuine signatures and forgeries, effectively widening the margin.

| Attraction Term                                   | Repulsion Term                                   |
| ------------------------------------------------- | ------------------------------------------------ |
| ![[hard_triplet_mining_attraction_term_hist.png]] | ![[hard_triplet_mining_repulsion_term_hist.png]] |

When evaluated on the withheld test set, the model yielded a classification accuracy of $78.23\%$.
This indicates that the system correctly identified signatures in approximately 78 out of every 100 instances, demonstrating acceptable performance for this specific evaluation context.
The relatively high anchor-positive cosine similarity alongside a low anchor-negative cosine similarity confirms the model’s capacity to discern forgeries from genuine signatures.
Furthermore, an analysis across the entire threshold range identified $0.667$ as the optimal threshold, at which point the misclassification rate was $21.77\%$.

| Category             | Metric / Score      | Result    |
| -------------------- | ------------------- | --------- |
| **Performance**      | Accuracy            | $78.23\%$ |
|                      | True Positive Rate  | $78.20\%$ |
|                      | False Positive Rate | $21.80\%$ |
|                      | AUC                 | $0.8607$  |
|                      | EER                 | $21.77\%$ |
|                      |                     |           |
| **Similarity Score** | Positive Score      | $0.7784$  |
|                      | Negative Score      | $0.3611$  |

Hard mining produced smooth and globally consistent boundaries, as illustrated by the clean ROC curve.
The curve yields an AUC of $0.8067$, suggesting that the embedding space learnt under hard triplet mining maintains a strong degree of class separability across varying thresholds.
However, the confusion matrix reveals a more detailed picture; even at the optimal threshold, False Acceptance Rate remains relatively high ($\approx 21.8\%$).
This indicates that a significant portion of skilled forgeries still resides within the acceptance margin of the genuine clusters.

These results demonstrate that while hard-negative mining successfully increases inter-class separation for the hardest violations, it does not guarantee robust generalisation across all variations of the same signature.
Consequently, hard triplet mining alone may not suffice for real-world signature verification, necessitating further refinement or the integration of complementary strategies.

![[hard_triplet_mining_roc.png]]

![[hard_triplet_mining_confusion_matrix.png]]

## Semi Hard Triplet Mining

Under the batch semi-hard mining strategy, the model demonstrated a capacity to separate negative samples from positive. At the start of training, the Attraction and Repulsion Terms exhibited similar means, indicating an initial lack of discriminative structure in the embedding space. By the end of training, the mean Attraction Term was successfully reduced from $1.1$ to $\approx 0.7$, while the Repulsion Term stabilised between $1.1 \text{and} 1.2$.

| Attraction Term                                           | Repulsion Term                                           |
| --------------------------------------------------------- | -------------------------------------------------------- |
| ![[semi_hard_triplet_mining_attraction_term_stacked.png]] | ![[semi_hard_triplet_mining_repulsion_term_stacked.png]] |

Visualisations via histograms confirmed these desired changes. The distribution of the Attraction term shifted to the left, indicating tightening clusters. Although the Repulsion Term appeared to shift towards the centre rather than staying on the right, this is a visual noise caused by the disproportionately high distances recorded during the start of the training. Nonetheless, the Repulsion Term shifted to a stable range, ensuring a consistent, clearly defined margin.

| Attraction Term                                        | Repulsion Term                                        |
| ------------------------------------------------------ | ----------------------------------------------------- |
| ![[semi_hard_triplet_mining_attraction_term_hist.png]] | ![[semi_hard_triplet_mining_repulsion_term_hist.png]] |

Upon evaluation with the test set, the model achieved a Recall rate of $82.10\%$ and a False Positive Rate (FPR) of $17.90\%$.
The high positive similarity scores and mid-range negative scores further validated the model’s ability to cluster positives and their variants.
Finally, at the optimal decision threshold of $0.777$, the model yielded a Total Error Rate of $17.88\%$.

| Category             | Metric / Score      | Result    |
| -------------------- | ------------------- | --------- |
| **Performance**      | Accuracy            | $82.12\%$ |
|                      | True Positive Rate  | $82.10\%$ |
|                      | False Positive Rate | $17.90\%$ |
|                      | AUC                 | $0.9071$  |
|                      | EER                 | $17.88\%$ |
|                      |                     | $ $       |
| **Similarity Score** | Positive Score      | $0.8639$  |
|                      | Negative Score      | $0.4967$  |

The ROC curve is smooth and clean with a high AUC score of 0.907.
While the confusion matrix still indicates some leakage, especially skilled forgeries that manage to bypass the threshold, the overall pattern suggests that semi-hard mining produces a balanced embedding space.
This strategy did not create a model that is overly sensitive to extreme outliers but rather one that focuses on samples that lie within the margin but not yet properly separated.

| ROC Curve                             | Confusion Matrix                                   |
| ------------------------------------- | -------------------------------------------------- |
| ![[semi_hard_triplet_mining_roc.png]] | ![[semi_hard_triplet_mining_confusion_matrix.png]] |

## $L_{SC+}$

Unlike standard triplet loss, the l$L_{SC+}$ loss function utilises cosine similarity, effectively inverting the traditional distance-based intuition. In this architecture, the repulsion mechanism pushes hard negatives toward lower similarity values, while the explicit positive pull ensures that the attraction term increases, but only up to the specified margin. This prevents the cluster from collapsing into a single point while ensuring that positive clusters are not too sparse.

During training, the model exhibited the desired behaviour: a rising Attraction Term and a diminishing Repulsion Term. The histograms for the Repulsion Term were notably spread out, indicating that the model is complying with the intended behaviour of ignoring easy forgeries and aggressively pushing hard negatives.

| Attraction Term                       | Repulsion Term                       |
| ------------------------------------- | ------------------------------------ |
| ![[lsc+_attraction_term_stacked.png]] | ![[lsc+_repulsion_term_stacked.png]] |

| Attraction Term                    | Repulsion Term                    |
| ---------------------------------- | --------------------------------- |
| ![[lsc+_attraction_term_hist.png]] | ![[lsc+_repulsion_term_hist.png]] |

On the test set, the model yielded the most promising results, achieving a recall of $84.80\%$, a False Positive Rate of 15.20%, and an overall accuracy of $84.85\%$. At an optimal threshold of $0.725$, a respectable Equal Error Rate (EER) of $15.15\%$ was recorded.

| Category             | Metric / Score      | Result    |
| -------------------- | ------------------- | --------- |
| **Performance**      | Accuracy            | $84.85\%$ |
|                      | True Positive Rate  | $84.80\%$ |
|                      | False Positive Rate | $15.20\%$ |
|                      | AUC                 | $0.9284$  |
|                      | EER                 | $15.15\%$ |
|                      |                     |
| **Similarity Score** | Positive Score      | $0.8444$  |
|                      | Negative Score      | $0.3644$  |

These metrics, alongside a superior AUC, point to a more discriminative embedding space than the triplet-based variants.
The ROC curve shows smooth global separation, while the confusion matrix confirms consistent rejection of forgeries.

| ROC Curve         | Confusion Matrix               |
| ----------------- | ------------------------------ |
| ![[lsc+_roc.png]] | ![[lsc+_confusion_matrix.png]] |

# Performance and Evaluation

## Quantitative Results

Amongst the three loss function, $L_{SC+}$ performed the best.
While some overlap persists, it is miniimsed compared to the other strategies.
This is likely to due its design of ignoring easy negatives, leading to closer, yet acceptable, distances.
At the optimal threshold, this model yielded the lowest false acceptance of forgeries

| Metric / Score     | $L_{SC+}$ (0.725) | Semi-Hard Triplets (0.777) | Hard Triplet (0.667) |
| ------------------ | ----------------- | -------------------------- | -------------------- |
| **TPR**            | 84.8%             | 82.1%                      | 78.20%               |
| **FPR**            | 15.2%             | 17.9%                      | 21.80%               |
| **AUC**            | 0.9284            | 0.9071                     | 0.8607               |
| **Positive Score** | 0.8444            | 0.8639                     | 0.7784               |
| **Negative Score** | 0.3644            | 0.4967                     | 0.3611               |

Both positive and negative scores of $L_{SC+}$ fall between those of semi hard (0.8639) and hard mining (0.7784).
While initially counterintuitive, this highlights a critial point: a hihger positive similarity doesn ot necessarily translate to better verification.
What matters is the margin between potsitive and negative distributions is what a model should prioritise.
$L_{SC+}$ achieves this by moderately enforcing intra-class compactness while consistently pushing hard negatives, creating more balanced clusters

The ability to decouple anchor-positive from anchor-negative pairs allows $L_{SC+}$ to receive independent gradient signals, ensuring continuous, informative updates regardless of triplet sampling quality.
In contrast, the coupling effect in hard and semi-hard triplet mining causes imbalance gradients, leading to overlap.
The smoother gradient dynamics of $L_{SC+}$ resulted in a more separable embedding space, improving discriminability across thresholds.

The operating threshold for $L_{SC+}$ falls between semi-hard and hard mining, reflecting a more balanced embedding distribution. By comparison, the lower threshold required by hard triplet ming reflects its tendency to over-compress positives, which shifts the negative distribution closer and increases false acceptance of forgeries.

Overall, the results indicate that $L_{SC+}$ produces more stable, generalizable, and discriminative embeddings. Despite not achieving the highest raw positive score, its improved separation of positive and negative distributions leads to superior AUC, TPR, FPR, and accuracy. This robustness arises from its decoupling of anchor-positive and anchor-negative contributions, which ensures continuous informative gradients and balanced embedding clusters.

## Embedding Behaviour and Analysis

Across all loss functions, the models exhibited the desired behaviour: a leftward shift of anchor-positive distance and a lingering anchor-negative distance on the right

However, upon scrutiny, some nuances can be observed; there exist overlapping between the attraction and repulsion terms.
The extent of this overlap and resulting stability varies significantly by strategy.

Hard triplet mining showed the most severe overlap between positive and negative distributions.
This resulted in a higher rate of false predictions, even at the model’s optimal performance threshold.
This aligned with the observation made by the authors of FaceNet [^3], who noted that an over-focus on hard triplets often causes model collapse.
The excessive penalty on hard negatives forced the model to over-compress anchor-positive pairs to compensate.
This over-fitting to specific hard samples reduced the generalisability of the model to unseen signatures from the same signer.
The imbalanced focus on hard negatives resulted in inconsistent separation of anchor-negative pairs, leaving some negatives closer to the anchor than desired.

Semi hard triplet mining exhibited less drastic overlap.
This is likely due to its enforcement of separations based on $D_{ap} + \alpha$ rather than purely focusing on the hardest violations.
However, this strategy can backfire when the threshold for forgeries falls within the $D_{ap} + \alpha$ range, where false predictions remain relatively high.
Notably, its reduced emphasis on hard triplets leads to slightly more dispersed anchor-positive pairs, increasing robustness to intra-class variation by allowing natural differences in genuine signatures.

# GradCAM

_Source: https://github.com/jacobgil/pytorch-grad-cam_

> I will only highlight weird, edge cases since they're the most interesting.
>
> GradCAM is designed with classification models in mind, so the following interpretation may seem unorthodox.

## ShortCut Learning

As much as I wish it to be, my model is far from perfect. A significant issue present in a lot of models (both traditional and deep learning models) is the emergence of shortcut learning [^8]. In certain true positive instances, the model bypassed stroke characteristics in favour of spurious background features, even if these artefacts had been largely mitigated.

![[signer_19_ch.png]]

One plausible reason to this phenomenon is that the loss function forces discrimination in the embedding space, even when the model fails to discern meaningful biometric differences between certain pairs. As a result, the model resorted to minor background artefacts as proxy to manipulate distances, even if these artefacts have been largely mitigated via binarisation.

Fortunately, this is not consistent across every signature.

| Signer 52             | Signer 21          |
| --------------------- | ------------------ |
| ![[signer_52_tp.png]] | ![[signer_19.png]] |

Grad-CAM also demonstrated that the data augmentation pipeline, particularly the geometric transformations, was effective in exposing the model to various signature scales and orientations. The model's ability to correctly detect the strokes of the signature, despite significant height and spatial variation, suggested that the augmentation strategy successfully prevented overfitting to a fixed signature location.

| Signer 21                    | Signer 52                 |
| ---------------------------- | ------------------------- |
| ![[signer_52_genuine_2.png]] | ![[signer_52_forged.png]] |

To further interpret the verification errors, Grad-CAM visualisations were reviewed together with the corresponding similarity scores and predicted labels. The observed cases were grouped into several qualitative categories. These categories do not represent exhaustive causal explanations; instead, they summarise recurring visual patterns observed from the heatmaps and error cases. Additionally, since Grad-CAM is qualitative and spatially course, these observations should not be interpreted as definitive proof of causation. Further ablation studies, such as removing small connected components, randomising signature placement, or cropping tightly around foreground strokes would be required to confirm the exact source of the shortcut behaviour.

### True Positive and True Negative: Stroke-Focused Correct Cases

Well, the model focused on the strokes of the signatures.

| Examples                |
| ----------------------- |
| ![[tp_example_one.png]] |
| ![[tp_example_two.png]] |
| ![[tn_example_one.png]] |
| ![[tn_example_two.png]] |

### False Negative: High Intra-Class Variation

In such cases of false negatives, the natural variation in writing style, slant, spacing, or stroke shape causes lower similarity. The model seemed to have focused on different regions of the stroke, possibly due to the variation between the two signatures. Consequently, the heatmaps generated were diffused or focused on incomplete or noisy stroke regions and genuine signatures were rejected despite possessing the same signer id.

| Examples                |
| ----------------------- |
| ![[fn_example_one.png]] |
| ![[fn_example_two.png]] |

### False Positive: Artefact shortcut or Similar Stroke Pattern

The heatmaps shown focus on isolated non-stroke components when extracting feature representation. This may be explained with the model's reliance on local shortcut cues that correlate with similarity but are not robust biometric features. Or, it might just be that the forgeries are just that good.

| Examples                |
| ----------------------- |
| ![[fp_example_one.png]] |
| ![[fp_example_two.png]] |

# Evaluation of Self-Sampled Dataset

The following evaluatino results were computed based on self-sampled dataset. Each participant was allowed to practice their forgeries before the final recording, creating a dataset that was potentially more difficult than the CEDAR dataset.

To ensure the best results, the threshold was recalibrated. Upon evaluation, the model achieved a slightly lower True Positive Rate (TPR), 83.3%, and conversely, a slightly higher Equal Error Rate (EER), 16.46%. The overall negative score had gone down to 0.1646, highlighting the increase in difficulty of the dataset. (I acknowledge that the dataset size is very influential to the result).

The high overall positive score (0.9450) and the low overall negative score indicated that the model was highly confident in clustering positive pairs; however, this came at the expense of pushing the threshold higher. This was not necessarily an issue, but it provided insight into how the model performed in a cross-dataset setting. Although the overall negative remained relatively low, the fact that the threshold had to be pushed so high suggested that some forgeries were also achieving high similarity scores. Consequently, to avoid a high rate of false positives, a stricter threshold had to be employed.

| Metrics (Threshold: 0.887) | Results |
| -------------------------- | ------- |
| Accuracy                   | 83.63%  |
| True Positive Rate         | 83.30%  |
| False Positive Rate        | 16.20%  |
| AUC                        | 0.9450  |
| EER                        | 16.46%  |

| Similarity Score (Cosine Similarity) | Results |
| ------------------------------------ | ------- |
| Positive Score                       | 0.9450  |
| Negative Score                       | 0.1646  |

The model was largely successful in predicting True Negatives, with 67 correct predictions; however, nearly 35% (13/38) of forgery-genuine pairs were falsely accepted. To provide us with insights to these False Positives, Grad-CAM was implemented.

![[self_sampled_confusion_matrix.png]]

## Grad-CAM

The low count of false positives allowed me to plot all 13 pairs.

In all of pairs involving signer 5, a common pattern was identified, the model appeared to have focused completely on the three specific dots on the top-right corner, ignoring other forgery indicators. Because these dots were an integral part of the signature, this phenomenon could not be flagged as a “shortcut learning” effect in the traditional sense, but rather as an optimisation of discriminative efficiency.

From the model’s standpoint, if a specific artifact (such as the three dots) was consistently present in each signature, it identified that artifact as a highly reliable feature. This caused a reduction in the model’s emphasis on more complex signature details. While efficient, this behaviour backfired in certain instances, most notably resulting in false positives. This may be attributed to the small volume of signatures per signer present in the training dataset; this constraint forced the model to rely on extreme, distinct markers rather than learning the full morphology of the signatures.

| ![[ss_signer_5_1.png]] | ![[ss_signer_5_2.png]] |
| ---------------------- | ---------------------- |
| Signer 5 Pair 1        | Signer 5 Pair 2        |

| ![[ss_signer_5_3.png]] | ![[ss_signer_5_4.png]] |
| ---------------------- | ---------------------- |
| Signer 5 Pair 3        | Signer 5 Pair 4        |

| ![[ss_signer_5_5.png]] | ![[ss_signer_5_6.png]] |
| ---------------------- | ---------------------- |
| Signer 5 Pair 5        | Signer 5 Pair 6        |

Aside from the model’s focus on the three dots, one other noteworthy observation was the model’s fixation on the top left corner of the images. This phenomenon could be attributed to the tendency of Convolutional Neural Networks (CNNs) to encode implicit positional information, despite their theoretical translation-invariant design, as demonstrated in [^9]. Such positional bias can arise from architectural factors, such as zero-padding, which introduced consistent boundary patterns that the model exploited during the learning process.

# Implementation and Deployment

I've published the model onto hugging face and deployed it via streamlit.

Check it out here! [Demo site](https://sct-signature-demo.streamlit.app/)

<Carousel>
<img src = "AI & Deep Learning\images\signature_verification\demosite_page.png">
<img src = "AI & Deep Learning\images\signature_verification\demosite_sidebar.png">
</Carousel>

> [!history] Previous version
> I developed a backend API using Flask to handle verification requests.
>
> A simple frontend is developed with React and a backend is developed using Flask microweb framework. I decided to implement a vector database using PostgreSQL with an open source plugin, `pgvector` [^10]. Finally, the entire system was containerised using Docker [^11] for easy deployment and testing.
>
> The webpage allows the user to insert a signature image along with the user's details, and upon verification, the similarity score, confidence score, Euclidean distance, and the distance score will be calculated and displayed.

# To-Do List

1. ~~Extensive hyperparameter fine-tuning~~
   - It usually results in diminishing return, which is why I didn't do it.
     - Also because the existence of loss function such as this complicates the matter much more.
2. ~~Implementation and deployment~~
   - It's deployed to [streamlit](https://sct-signature-demo.streamlit.app/)
3. ~~Try different datasets~~
   - ~~I'm making my own test dataset~~
     - I made the dataset! Look at []

[^1]: [EfficientNetV2](https://arxiv.org/abs/2104.00298)

[^2]: [Hard negative examples are hard, but useful](https://arxiv.org/abs/2007.12749)

[^3]: [FaceNet: A unified embedding for face recognition and clustering](https://ieeexplore.ieee.org/document/7298682)

[^4]: [Otsu's Method](https://en.wikipedia.org/wiki/Otsu%27s_method)

[^5]: [CEDAR](https://cedar.buffalo.edu/signature/)

[^6]: [Pretrained models](https://docs.pytorch.org/vision/main/models.html)

[^7]: [The book](https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/)

[^8]: [Couldn't find a source that isn't Wikipedia](https://en.wikipedia.org/wiki/Clever_Hans)

[^9]: [How much Position Information Do Convolutional Neural Networks Encode](https://arxiv.org/abs/2001.08248v1)

[^10]: [pgvector](https://github.com/pgvector/pgvector)

[^11]: [docker](https://www.docker.com/)
