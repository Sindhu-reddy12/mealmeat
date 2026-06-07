"""
NutriSnap AI — Training Script
Uses MobileNetV2 transfer learning to classify Indian food images.

Dataset expected layout:
  dataset/
    Biryani/   (*.jpg)
    Dosa/      (*.jpg)
    ...

Run:
  python train.py
"""

import os
import json

DATASET_DIR = "dataset"
MODEL_SAVE_PATH = "model/food_classifier.h5"
EPOCHS = 10
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

def train():
    try:
        from importlib import import_module

        keras = import_module("tensorflow.keras")
    except ImportError:
        try:
            from importlib import import_module

            keras = import_module("keras")
        except ImportError:
            print("❌ TensorFlow/Keras not installed. Install tensorflow or keras to continue.")
            return

    MobileNetV2 = keras.applications.MobileNetV2
    Dense = keras.layers.Dense
    GlobalAveragePooling2D = keras.layers.GlobalAveragePooling2D
    Dropout = keras.layers.Dropout
    Model = keras.models.Model
    ImageDataGenerator = keras.preprocessing.image.ImageDataGenerator

    if not os.path.isdir(DATASET_DIR):
        print(f"❌ Dataset directory '{DATASET_DIR}/' not found.")
        print("   Please download an Indian food image dataset and place it there.")
        return

    # Load class names from dataset folders
    class_names = sorted([
        d for d in os.listdir(DATASET_DIR)
        if os.path.isdir(os.path.join(DATASET_DIR, d))
    ])
    print(f"✅ Found {len(class_names)} food classes: {class_names}")

    # Data generators
    datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
        rotation_range=20,
        zoom_range=0.15,
        horizontal_flip=True
    )

    train_gen = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training"
    )
    val_gen = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation"
    )

    # Build model
    base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.3)(x)
    predictions = Dense(len(class_names), activation="softmax")(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    # Train
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS)

    # Save model
    os.makedirs("model", exist_ok=True)
    model.save(MODEL_SAVE_PATH)
    print(f"✅ Model saved to {MODEL_SAVE_PATH}")

    # Save class index mapping
    class_indices = train_gen.class_indices
    with open("model/class_indices.json", "w") as f:
        json.dump(class_indices, f, indent=2)
    print("✅ class_indices.json saved.")

if __name__ == "__main__":
    train()
