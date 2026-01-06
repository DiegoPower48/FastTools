import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

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
    const { uid, id, file } = await req.json();

    if (!uid || !id || !file) {
      return Response.json(
        { error: "uid, id and file are required" },
        { status: 400 }
      );
    }
    const publicId = `fasttools/${uid}/video${id}`;

    const uploadResult = await cloudinary.uploader.upload(file, {
      resource_type: "video",
      public_id: publicId,
      overwrite: true, // 🔁 reemplazo explícito
      invalidate: true, // ♻️ limpia CDN
    });

    return Response.json(
      {
        success: true,
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading video:", error);
    return Response.json({ error: "Error uploading video" }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  try {
    const { uid } = await params;
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: `fasttools/${uid}/video`, // Filtramos por el prefijo video
    });

    const data = await s3Client.send(command);

    if (!data.Contents) return Response.json([], { status: 200 });

    const resources = data.Contents.map((file) => ({
      secure_url: `${process.env.R2_PUBLIC_URL}/${file.Key}`,
    }));

    return Response.json(resources, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error" }, { status: 500 });
  }
}
