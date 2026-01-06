// /api/get-background-signature.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { uid, id, contentType } = await req.json();

    if (!uid || !id) {
      return Response.json({ error: "Missing uid or id" }, { status: 400 });
    }

    const fileName = `fasttools/${uid}/video${id}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType || "video/mp4", // Vital para que se reproduzca en el navegador
    });

    // Generar URL firmada válida por 5 minutos
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return Response.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("R2 Signature error:", error);
    return Response.json(
      { error: "Could not generate upload URL" },
      { status: 500 }
    );
  }
}
