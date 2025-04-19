---
title: Offline Signature Draft
draft: true
tags: 
description:
---
This documentation is structured as such:
1. Research and explanation
2. Implementation.

>Check out the footnote for the resources!

To perform signature verification with deep learning, there are four steps: [^1][^2][^3]
1. Signature Detection
2. Signature Extraction
3. Feature Extraction
4. Signature Matching

# Signature Detection
## Object Detection Model

The document or image is analysed to identify patterns, shapes, or characteristics that are typically associated with handwritten signatures. 

This is achievable by leveraging existing object detection models such as:
1. [Ultralytics's YOLO frameworks](https://github.com/ultralytics)
2. [OpenMMLabs's MMDetection](https://github.com/open-mmlab/mmdetection)
3. [YOLOX](https://github.com/Megvii-BaseDetection/YOLOX)
4. [Wong Kin Yiu's YOLOv9](https://github.com/WongKinYiu/yolov9)
5. [YOLO NAS](https://github.com/Deci-AI/super-gradients)

*These are just a few examples of object detection frameworks or models. You can also make your own with OpenCV, but it's more work.*

I've decided to utilise the `YOLO NAS` pretrained model. 

## Labelling Objects in Images

However, before we can fine-tune the pre-trained model, we have to first tell the model what to look for. Thus, begin the tedious task of manually labelling images. 

Fortunately, [`label-studio`](https://labelstud.io/) has a feature that lets me incorporate a model that assists me in labelling images. 



# Prototype

[^1]: [Check Forgeries: Leveraging AI and Machine Learning for Signature Verification](https://orbograph.com/check-forgeries-leveraging-ai-and-machine-learning-for-signature-verification/) 
[^2]: [How AI Works in Signature Verification Tools](https://sqnbankingsystems.com/blog/how-ai-works-in-signature-verification-tools/)
[^3]: [How AI and ML can Revolutionize Banks Signature Verification Process](https://www.forbes.com/councils/forbestechcouncil/2023/08/09/how-ai-and-ml-can-revolutionize-banks-signature-verification-process/)