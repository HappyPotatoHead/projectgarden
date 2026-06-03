---
title: Stacking Data Augmentations - An Unorthodox Approach
draft: false
tags: deep learning, cnn, data augmentations, plantdoc, plantvillage
description:
---

It has no real-world application, as no one really trains on dirty data and then test on clean data, but it is interesting to see the effects of data augmentations on the performance of CNN models.

Both PlantDoc and PlantVillage datasets are available on Kaggle:

- [PlantDoc](https://www.kaggle.com/datasets/abdulhasibuddin/plant-doc-dataset)
- [PlantVillage](https://www.kaggle.com/datasets/mohitsingh1804/plantvillage)

# Data Augmentations?

> [!Definition] Data Augmentation
> In case you don't know what data augmentation means
>
> According to [this paper by Alhassan Mumuni and Fuseini Mumuni](https://www.sciencedirect.com/science/article/pii/S2590005622000911)
>
> - _The main goal of data augmentation is to increase the volume, quality and diversity of training data_

The best practice when it comes to applying data augmentations is to apply them on-the-go, instead of applying the data augmentations and saving the datasets separately. But, I did exactly that (augmenting and saving them externally). This specific approach is not exactly the best, but it did save me memory and time on preprocessing and training.

_But why is this distinction (on-the-fly vs static) important to make?_

The choice between _offline_ and _online_ data augmentation is dependent on the time and the computing power that you possess, and the amount of variations that you want to have.

For maximum variation, _online_ augmentation works best; but if you lack computing power to perform complex augmentations on large datasets on the fly, _offline_ augmentation helps by processing the images beforehand, reducing training bottlenecks and preventing memory errors.

Nonetheless, storage sizes and computing power shouldn't be issue as cloud platforms exists \[[Kaggle](https://www.kaggle.com/), [Google Colab](https://colab.research.google.com/), [AWS Sagemaker](https://aws.amazon.com/sagemaker/)], so you really should opt for _online_ data augmentation as the default.

And as for why this wasn't the case for this project... well, you'll see

# So, what happens when you stack data augmentations?

As mentioned earlier, this project explores what happens when data augmentations is applied repeatedly, and how different augmentation factors affect model performance.

The augmentations were stacked in the following: $1\times, 3\times, 5\times, 8\times, 10\times, 12\times$

There really wasn't any particular reason as to why these _factors_ (I'll call them factors now) were chosen. I felt that they are spaced enough to cover sufficient grounds, but not narrow enough that I recorded meaningless micro-progression.

<span style='font-size: 1.5em; font-weight:1000;'>It's basically a play on probability, at least that's how I see it.</span>

> _But, why is that?_

Something that we have to keep in mind is that data augmentation is applied at random. If you think that applying seed to the environment eliminates the randomness, you are misunderstanding the seeding in the first place. Seeding ensures that the experiment is reproducible across multiple sessions; it does not eliminate the randomness within the session itself.

Yes, the same augmentations will be applied, but the augmentations applied were random in the first place. Applying a seed meant fixing the "random".

Rant aside, we have to look at the result of the data augmentation before proceeding further. _Please note that I am cherry-picking the result for the sake of examples_

| Example One          | Example Two          |
| -------------------- | -------------------- |
| ![[example_one.png]] | ![[example_two.png]] |

Both examples here show two instances where the data augmentation ($1 \times$) is effective. The noise (hands and pots) are effectively removed from the images. Now, imagine stacking this multiple times; it may completely distort the image, not only removing non-plant morphology, but also the leaves themselves.

Obviously there are cases where the data augmentation missed the [mark](https://knowyourmeme.com/memes/think-mark/):

| Failed                 |
| ---------------------- |
| ![[example_three.png]] |

The random cropping missed the berry, and the fingers are still in the image. Cases such as this is where compounding the augmentation may assist in removing noises.

With that said, the factor determines the amount of times the "random" data augmentations are applied; and as the factor increases, the same image is exposed to more rounds of random transformation. So, if it's $3\times$, it means that data augmentation is applied three times onto the same dataset consecutively.

The hypothesis is that at higher augmentation factors, such as $8 \times, 10 \times,$ and $12 \times$, may eventually reduce model performance because repeated transformations can distort the original plant morphology.

# Results

> I'll spare detailed explanation about training, but I will put the configurations in a callout block below

> [!Danger] I couldn't get the data augmentation seeding to work
> Upon discovering that, I should have ran the pipeline multiple times and then average the results, but I didn't because it will take way too long on free compute and storage.

> [!INFO]- Training Configurations
> Model trained:
>
> - EfficientNetV2
> - Swin Transformer
> - A combination of the two
>
> Batch size: 32 <br>
> Epoch: 100 <br>
> Early stopping: 10 <br>
> Learning rates:
>
> - Backbone: $1\times10^{-5}$
> - Head: $1\times10^{-4}$
>
> Optimiser: AdamW <br>
> Scheduler: Linear followed up by cosine decay

_So, what's the outcome?_

I was entirely wrong. Well, it could be that the augmentation factors are still not that big to cause major distortion; however, some observations can still be made.

> As you go on, keep this quote by Ronald Coase in mind, _If you torture the data long enough, it will confess_.

![[results_graph.png]]

<span style='font-size: 1.5em; font-weight:1000;'>Observation 1</span>

At $1\times$, the Swin model (0.42) shows a strong baseline performance in cross-dataset generalisation, followed by EfficientNetV2 (0.37) and Hybrid (0.31). This may be due to the transformer’s global attention design, enabling Swin to separate background noise from leaf structures using image-wide context, allowing it to focus directly on leaf pathology with fewer augmentation and samples.

<span style='font-size: 1.5em; font-weight:1000;'>Observation 2</span>

Between $3\times$ and $10 \times$, EfficientNetV2 tops other models with a gradual increment in accuracy, peaking at 0.56; however, at $12\times$, the model accuracy fell to 0.54, which isn't something to raise alarms about; it could be due to the randomness that occurred.

> My seeding didn't work, which is strange

Despite the dip, the model demonstrated strong generalisability and stable performance at a moderate augmentation factor. The EfficientNetV2 architecture is optimised for spatial information, so the high augmentation level ($12\times$) may have caused overly aggressive distortions on the samples. Consequently, this disrupts the local spatial rules that the EfficientNetV2 relied on, causing it to lose cues of the diseases amongst the noises.

> Or it's very likely that this is just one of the many variations of the randomness.

<span style='font-size: 1.5em; font-weight:1000;'>Observation 3</span>

At $8 \times$, EfficientNetV2 (-2.40$\%$) and Swin (-2.58$\%$) models show significant dip while Hybrid (+0.54$\%$) shows slight improvement compared to $5 \times$. This indicates that at $8\times$, the augmentations introduced distortions that disrupted EfficientNetV2 and Swin models. The hybrid model may have just brute forced its way through the distortions.

> Or, it's entirely possible that the augmentations for this particular run is _lucky_, managing to remove the noises without distorting the important features as much.

<span style='font-size: 1.5em; font-weight:1000;'>Observation 4</span>

The Hybrid model exhibits a steady performance increase across augmentation levels, at $12 \times$, the Hybrid (+5.69$\%$) model showed a significant performance gain, increasing from 0.51 to 0.57. The model surpassed the peak performance of EfficientNetV2 ($10\times$ and $12\times$ model), possibly indicating that Hybrid architecture scales most effectively with higher data augmentations, given its high parameter count.

> I am not ruling out the possibility that the run simply was _lucky_, but models with higher parameter counts are observed to be have performance in complex tasks

# Conclusion and Takeaway

This isn't exactly a slam dunk of a finding on cross-dataset generalisation because of the glaring failed seeding problem that I just couldn't fix and the dirty to clean dataset approach is just not applicable to real life.

However, it does teach us a couple of things:

1. Data augmentations do have a positive effect in the performance of the model, especially when the dataset is dirty
2. Static data augmentation, albeit discouraged, does have its place.
   - I won't be doing it any time soon though
3. The results become difficult to interpret at a fine-grained level when seeding is not implemented properly, since small differences between augmentation factors may be caused by randomness rather than the augmentation factor itself.
   - **BUT**, I would still argue that it lets us see the **overall** trend present in the result.
     - Nonetheless, multiple runs should have been made.

All in all, this is a short experiment to study the effects of data augmentations and cross-dataset generalisation. Let me know what you think: [here](https://www.linkedin.com/in/jimmy-ding/) or [here](mailto:jimmydingjk@gmail.com)

> Honestly, in hindsight, I should have picked better a pair of datasets; it would have saved me all the headaches.

> [!Announcement]
> Hey, since you're here, check out [[Resources]]!
>
> I've listed all (_as many as I can remember_) the free sources that I have used throughout the years.
>
> If you have any that you would like to share, [hit me up](https://www.linkedin.com/feed/)! I would love to have a look and include them.
