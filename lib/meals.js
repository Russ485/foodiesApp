import { S3 } from "@aws-sdk/client-s3";
import { collection, addDoc, getDocs } from "firebase/firestore";
import slugify from "slugify";
import xss from "xss";
import { db } from "./firebase";

const s3 = new S3({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getMeals() {
  const mealsSnapshot = await getDocs(collection(db, "foodies"));
  const mealsData = Object.values(mealsSnapshot.docs).map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data };
  });

  return mealsData;
}

export async function getMeal(slug) {
  const mealsData = await getMeals();

  const specificMeal = mealsData.find((meal) => meal.slug === slug);
  return specificMeal;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const randomString = Math.random().toString(36).substring(2);
  const fileName = `${meal.slug}-${randomString}.${extension}`;

  try {
    const bufferedImage = await meal.image.arrayBuffer();
    s3.putObject({
      Bucket: "foodiesbucket1992",
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });

    meal.image = fileName;

    const docRef = await addDoc(collection(db, "foodies"), {
      title: meal.title,
      slug: meal.slug,
      image: meal.image,
      summary: meal.summary,
      instructions: meal.instructions,
      creator: meal.creator,
      creator_email: meal.creator_email,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
