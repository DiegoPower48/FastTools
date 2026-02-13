"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import * as jose from "jose";
import styles from "../style.module.css";
import { DialogClose } from "@radix-ui/react-dialog";
import { Verified } from "lucide-react";

export default function JWTVerifier({ theme, textTheme }) {
  const [verifyToken, setVerifyToken] = useState("");
  const [verifySecret, setVerifySecret] = useState("");
  const [verifyPublicKey, setVerifyPublicKey] = useState("");
  const [verifyAlgorithm, setVerifyAlgorithm] = useState("HS256");

  // Estados para los datos decodificados
  const [headerResult, setHeaderResult] = useState(null);
  const [payloadResult, setPayloadResult] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    setIsVerified(false); // Reset al iniciar
    try {
      if (!verifyToken) return toast.error("Paste a token to verify");

      // 1. DECODIFICACIÓN (Sin llave)
      const parts = verifyToken.split(".");
      if (parts.length !== 3) throw new Error("Invalid format");

      // Decodificar Header (Parte 0)
      const header = JSON.parse(
        atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")),
      );
      setHeaderResult(header);

      // Decodificar Payload (Parte 1)
      const payload = jose.decodeJwt(verifyToken);
      setPayloadResult(payload);

      // 2. VERIFICACIÓN (Solo si hay llaves presentes)
      const algFromToken = header.alg;

      if (verifySecret && algFromToken?.startsWith("HS")) {
        const key = new TextEncoder().encode(verifySecret);
        await jose.jwtVerify(verifyToken, key);
        setIsVerified(true);
        toast.success("Signature Verified!");
      } else if (verifyPublicKey && algFromToken === "RS256") {
        const pubKey = await jose.importSPKI(verifyPublicKey.trim(), "RS256");
        await jose.jwtVerify(verifyToken, pubKey);
        setIsVerified(true);
        toast.success("Signature Verified!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid signature or format");
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-bold ">TOKEN</label>
          <input
            type="text"
            style={{
              color: textTheme,
              outline: `1px solid ${textTheme}50`,
              backgroundColor: theme,
            }}
            value={verifyToken}
            onChange={(e) => setVerifyToken(e.target.value)}
            className="p-2 rounded bg-transparent font-mono text-sm w-full"
            placeholder="Paste a JWT token here..."
          />
        </div>
        <button
          onClick={handleVerify}
          style={{ color: theme, backgroundColor: textTheme }}
          className="rounded p-2 font-bold w-full h-10 mt-2 hover:opacity-90"
        >
          VERIFY
        </button>
        <div className="w-full h-full flex gap-2 items-center">
          <div className="w-1/4">
            <label className="text-sm font-bold ">Algorithm</label>
            <Select
              style={{ color: textTheme }}
              value={verifyAlgorithm}
              onValueChange={setVerifyAlgorithm}
              className="p-2 rounded w-full bg-transparent"
            >
              <SelectTrigger
                style={{
                  color: textTheme,
                  border: `1px solid ${textTheme}50`,
                  backgroundColor: theme,
                }}
                className=" w-[100px] md:w-[150px]"
              >
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent
                style={{
                  color: textTheme,
                  border: `1px solid ${textTheme}50`,
                  backgroundColor: theme,
                }}
              >
                <SelectItem value="HS256">HS256 (SHA-256)</SelectItem>
                <SelectItem value="HS384">HS384 (SHA-384)</SelectItem>
                <SelectItem value="HS512">HS512 (SHA-512)</SelectItem>
                <SelectItem value="RS256">RS256 (RSA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            {verifyAlgorithm != "RS256" ? (
              <>
                <label className="text-sm font-bold ">Secret key</label>
                <input
                  type="text"
                  style={{
                    color: textTheme,
                    outline: `1px solid ${textTheme}50`,
                    backgroundColor: theme,
                  }}
                  value={verifySecret}
                  onChange={(e) => setVerifySecret(e.target.value)}
                  className="p-2 rounded bg-transparent w-full"
                  placeholder="Secret key"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Dialog>
                  <DialogTrigger
                    style={{
                      color: theme,
                      backgroundColor: textTheme,
                    }}
                    className="p-2 rounded w-3/4 md:w-1/4 font-semibold hover:opacity-80"
                  >
                    PUBLIC KEY
                  </DialogTrigger>
                  <DialogContent
                    style={{
                      color: textTheme,
                      backgroundColor: theme,
                      border: `1px solid ${textTheme}`,
                    }}
                    className="flex flex-col  justify-center gap-2 w-full md:w-80 h-[80vh] 2xl:h-[60vh] 2xl:w-[90vw] bg-black border-white border-2 text-white overflow-hidden"
                  >
                    <DialogHeader></DialogHeader>
                    <DialogTitle
                      className="text-center"
                      style={{ color: textTheme }}
                    >
                      PUBLIC KEY
                    </DialogTitle>
                    <div
                      style={{ color: textTheme }}
                      className="flex flex-col gap-4"
                    >
                      <textarea
                        style={{
                          outline: `1px solid ${textTheme}`,
                          backgroundColor: theme,
                        }}
                        placeholder={`-----BEGIN PUBLIC KEY-----\n\n\n\n........\n\n\n\n\n\n\n-----END PUBLIC KEY-----`}
                        value={verifyPublicKey}
                        onChange={(e) => setVerifyPublicKey(e.target.value)}
                        className=" p-2 rounded bg-black font-mono text-xs w-full h-80 resize-none"
                      />
                      <DialogClose
                        style={{ color: theme, backgroundColor: textTheme }}
                        className="flex h-10 w-full font-bold items-center justify-center hover:opacity-80 duration-300 p-2 rounded"
                      >
                        CLOSE
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}{" "}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 w-full">
        <div className="">
          <label className="text-sm font-bold ">Decoded Header</label>
          <pre
            style={{
              "--theme": textTheme,
              border: `1px solid ${textTheme}`,
              color: textTheme,
              background: theme,
            }}
            className={`p-2 rounded overflow-auto text-sm break-all h-40 ${styles.scrollContainer}`}
          >
            {headerResult && JSON.stringify(headerResult, null, 2)}
          </pre>
        </div>
        <div className="">
          <label className="text-sm font-bold ">Decoded Payload</label>
          <pre
            style={{
              "--theme": textTheme,
              border: `1px solid ${textTheme}50`,
              color: textTheme,
              background: theme,
            }}
            className={`p-2 rounded overflow-auto text-sm break-all h-40 ${styles.scrollContainer}`}
          >
            {payloadResult && JSON.stringify(payloadResult, null, 2)}
          </pre>
        </div>
      </div>
      <div className="w-full text-center font-bold">
        {isVerified && "Secret Verified!"}
      </div>
    </>
  );
}
