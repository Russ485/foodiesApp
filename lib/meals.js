//import fs from "node:fs";
import { S3 } from "@aws-sdk/client-s3";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const s3 = new S3({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  // throw new Error("Loading meals failed");
  return db.prepare(`SELECT * FROM meals`).all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const randomString = Math.random().toString(36).substring(2);
  const fileName = `${meal.slug}-${randomString}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  // const stream = fs.createWriteStream(`public/images/${fileName}`);

  // stream.write(Buffer.from(bufferedImage), (error) => {
  //   if (error) {
  //     throw new Error("Saving image failed!");
  //   }
  // });

  s3.putObject({
    Bucket: "foodiesbucket1992",
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  //meal.image = `/images/${fileName}`;

  meal.image = fileName;

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (   
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,  
        @image,
        @slug
      )
    `
  ).run(meal);
}
