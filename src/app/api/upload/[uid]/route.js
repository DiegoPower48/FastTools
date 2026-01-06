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

export async function POST(req, { params }) {
  const { uid } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const slot = formData.get("slot");

    if (!file) {
      return Response.json({ error: "File missing" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Definimos el nombre del archivo (Key)
    // Ejemplo: fasttools/user123/image1.png
    const fileName = `fasttools/${uid}/image${slot}`;
    const fileType = file.type || "image/jpeg";

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: fileType, // IMPORTANTE para que el navegador lo muestre bien
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construimos la URL pública manualmente
    const secure_url = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return Response.json({ secure_url }, { status: 200 });
  } catch (error) {
    console.error("R2 Upload Error:", error);
    return Response.json({ error: "Error uploading to R2" }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  try {
    const { uid } = await params;
    const prefix = `fasttools/${uid}/`;

    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: prefix, // Filtra para que solo traiga lo de ese usuario
    });

    const data = await s3Client.send(command);

    // Si no hay archivos, devolvemos array vacío
    if (!data.Contents) {
      return Response.json([], { status: 200 });
    }

    // Mapeamos los datos para que tengan un formato similar al que usabas
    const resources = data.Contents.map((file) => ({
      public_id: file.Key,
      secure_url: `${process.env.R2_PUBLIC_URL}/${file.Key}`,
      last_modified: file.LastModified,
    }));

    // Ordenamos por el número en "imageN" igual que antes
    resources.sort((a, b) => {
      const getNumber = (id) => {
        const match = id.match(/image(\d+)$/);
        return match ? Number(match[1]) : 999;
      };
      return getNumber(a.public_id) - getNumber(b.public_id);
    });

    console.log(`Imágenes encontradas en R2: ${resources.length}`);

    return Response.json(resources, { status: 200 });
  } catch (error) {
    console.error("Error en GET R2:", error);
    return Response.json(
      { error: "Error fetching images from R2" },
      { status: 500 }
    );
  }
}
